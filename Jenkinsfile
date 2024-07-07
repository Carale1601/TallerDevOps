pipeline {
    agent any
    environment {
        KUBECONFIG = 'C:\\Users\\eric_amaya\\.kube\\config'
        PORT = '3000'
        DATABASE_PATH = 'database/db.sqlite'
    }
    stages {
        stage('Build') {
            steps {
                echo 'building the application..'
                script {
                    dockerImage = docker.build('ericamaya29/user-management:latest', '--build-arg PORT=${PORT} --build-arg DATABASE_PATH=${DATABASE_PATH} -f user-management/Dockerfile user-management/.')
                }

            }
        }
        stage('Test Docker Image') {
            steps {
                script {
                    bat 'docker run ericamaya29/user-management:latest npm run test' 
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Autentica y empuja la imagen a Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-crd') {
                        dockerImage.push("latest")
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    dir('k8s/project') {
                        bat 'helm version'
                        bat 'kubectl config view'
                        bat 'kubectl config get-contexts'

                        // Check if the release exists and uninstall if it does
                        script {
                            def releaseExists = bat(script: 'helm status project', returnStatus: true) == 0
                            if (releaseExists) {
                                echo 'Existing project found, uninstalling...'
                                bat 'helm uninstall project'
                            } else {
                                echo 'No existing project found.'
                            }
                        }

                        bat 'helm install project .'
                        bat 'helm upgrade project .'
                        bat 'kubectl get services'
                        bat 'kubectl get pods'
                        // Use start to run port-forward commands in parallel
                        bat 'start cmd /c "kubectl port-forward service/user-management-testing 3001:3001"'
                        bat 'start cmd /c "kubectl port-forward service/user-management 3000:3000"'
                    }       
                }
            }
        }

    }
}
