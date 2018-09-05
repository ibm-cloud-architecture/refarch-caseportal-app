pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh './scripts/build.sh auto'
                sh 'cd chart; helm upgrade casewebportal'
            }
        }
    }
}
