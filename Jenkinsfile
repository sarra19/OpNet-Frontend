pipeline {
    agent any
//     environment {
//     registryCredentials = "nexus"
//     registry = "172.20.10.6:8083"
// }
    stages {
        
        stage('Install Frontend dependencies') {
            steps {
                sh 'npm install --force'
            }
        }

        stage('Build application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps{
                script {
                def scannerHome = tool 'scanner'
                 withSonarQubeEnv{
                sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=reactapp \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://172.20.10.6:9000 \
                            -Dsonar.login=squ_36eb9cc444e1024b52819e1249830e65ee4f1a0e"
                    }
                }
            }
        }
  

    }
}
