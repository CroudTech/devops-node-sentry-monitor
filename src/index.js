const monitor = require('sentry-monitor');
var request = require('sync-request');

function get_env_var(env_var, required=true) {
    if (undefined == process.env[env_var] && required) {
        console.error("Please set " + env_var + " environment variable")
        process.exit(126)
    }
    return process.env[env_var]
}

function getAllProjects(SENTRY_AUTH, url="https://sentry.io/api/0/projects/"){
    res = request("GET", url, {
        headers: {
          Authorization: SENTRY_AUTH
        },
        json: true
    })

    if (res.statusCode != "200") {
      throw new Error(`Status ${res.statusCode} on ${url}`);
    }
    data = JSON.parse(res.getBody().toString())
    
    projects = []
    for (key in data) {
        item = data[key]
        filter = get_env_var('SENTRY_MONITOR_SENTRY_PROJECT_FILTER', false)
        if (undefined != filter) {
            var re = new RegExp(filter);
            if (!item['slug'].match(re)) {
                continue
            }
        }
        if (item['status'] == 'active') {
            projects.push(item['slug'])
        }
    }
    return projects
}

var config = {
    SENTRY_AUTH: "Bearer " + get_env_var('SENTRY_MONITOR_SENTRY_AUTH_TOKEN'),
    NEW_RELIC_AUTH: get_env_var('SENTRY_MONITOR_NEW_RELIC_TOKEN'),
    NEW_RELIC_ACCOUNT_ID: get_env_var('SENTRY_MONITOR_NEW_RELIC_ACCOUNT_ID'),
    org: get_env_var('SENTRY_MONITOR_SENTRY_ORG'),
    projects: [],
};

projects = get_env_var('SENTRY_MONITOR_SENTRY_PROJECTS')

if (projects == 'ALL') {
    projects = getAllProjects("Bearer " + get_env_var('SENTRY_MONITOR_SENTRY_AUTH_TOKEN'),)
} else {
    projects = projects.split(',')
}

for (project in projects) {
    config['projects'].push({
        'project': projects[project],
        'filters': [
            {
                name: 'Tags',
                searchTerms: [''],
                tags: ['environment', 'level', 'server_name', 'trace'],
                environment: get_env_var('SENTRY_MONITOR_SENTRY_ENVIRONMENT', false)
            }
        ]
    });
}

const app = monitor(config);
if (get_env_var('SENTRY_MONITOR_HTTP_MODE', false) == 1) {
    app.express.listen(3000, () => console.log('Listening on port 3000'));  
} else {
    app.execute({debug: get_env_var('SENTRY_MONITOR_DEBUG', false) == 1})
}



//