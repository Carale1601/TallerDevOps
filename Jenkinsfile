pipeline {
    agent any
    environment {
        KUBECONFIG = 'C:\\Users\\eric_amaya\\.kube\\config'
    }
    stages {
        stage('Build') {
            steps {
                echo 'building the application..'
                script {
                    dockerImage = docker.build('ericamaya29/user-management:latest', '-f user-management/Dockerfile user-management/.')
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
                        bat 'helm install project .'
                        bat 'helm project .'
                        bat 'kubectl port-forward service/user-management-testing 3001:3001 & kubectl port-forward service user-management 3000:3000 &'
                    }       
                }
            }
        }

    }
}
