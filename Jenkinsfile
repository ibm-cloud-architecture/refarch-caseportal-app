pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'ng test'
                sh 'docker build -t case/portal .'
                sh 'docker tag case/portal green2-cluster.icp:8500/browncompute/casewebportal:v0.0.1'
                sh 'cd chart; helm package casewebportal'
            }
        }
    }
}
