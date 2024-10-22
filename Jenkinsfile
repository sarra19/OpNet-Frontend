pipeline {
    agent any

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
            steps {
                script {
                    def scannerHome = tool 'scanner'  // Ensure 'scanner' matches your tool configuration name
                    def sonarToken = credentials('sonar-token')  // Replace with your actual Jenkins credential ID for SonarQube
                    withSonarQubeEnv('SonarQube') {  // Replace 'SonarQube' with your actual SonarQube installation name if it's different
                        sh "${scannerHome}/bin/sonar-scanner " +
                           "-Dsonar.projectKey=reactapp " +
                           "-Dsonar.sources=src " +
                           "-Dsonar.host.url=http://192.168.52.4:9000 " +
                           "-Dsonar.login=${sonarToken}"
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
                echo "Logging into DockerHub..."
                echo $DOCKER_PASSWORD | docker login -u farahtelli --password-stdin
                docker push farahtelli/opnet:1.0.0
                '''
            }
        }
             
        stage('Start application') {
            steps {
                sh 'npm start &'
            }
        }

        stage('Run Prometheus') {
            steps {
                sh 'docker restart prometheus'
            }
        }

        stage('Run Grafana') {
            steps {
                sh 'docker restart grafana'
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
