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

            stage('Docker build') {
            steps {
                sh 'docker build -t farahtelli/opnet:1.0.0 .'
            }
        }
          stage('Deploying to DockerHub') {
            steps {
                sh '''
                docker login -u farahtelli -p farouha2323
                docker push farahtelli/opnet:1.0.0
                '''
            }
        }
             
        stage('Start application') {
            steps {
                sh 'npm start &'
            }
        }
        // stage('Deploy to Nexus') {
        //     steps {
        //         script {
        //             def registryCredentials = 'nexus'
        //             def registry = '172.20.10.6:8083'
                    
        //             docker.withRegistry("http://${registry}", registryCredentials) {
        //                 sh "docker push ${registry}/repository/docker-repo:1.0.0"
        //             }
        //         }
        //     }
        // }

        stage('Run prometheus') {
            steps {
                sh 'docker restart prometheus'
            }
        }
        stage('Run Grafana') {
            steps {
                sh 'docker restart grafana'
            }
        }
      stage('Test Unitaire') {
    steps {
                sh 'npm test'
        }
      }

    }
}
