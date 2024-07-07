pipeline {
    agent any
    environment {
        PATH = "C:\\Users\\PC\\AppData\\Local\\Programs\\Python\\Python312;C:\\Users\\PC\\AppData\\Local\\Programs\\Python\\Python312\\Scripts;${env.PATH}"
    }
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    bat 'python --version'
                    bat 'pip --version'
                    bat 'gdown --version'
                }
            }
        }
        stage('Download kube config') {
            steps {
                script {
                    bat 'gdown https://drive.google.com/uc?id=19n4SU_uAsIliucI8kbsCqtW0JPiGimUP -O C:\\Users\\eric_amaya\\.kube\\config'
                }
            }
        }
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
                    dir('k8s/projects') {
                        bat 'kubectl config view --raw > ~/.kube/config'
                        bat 'helm uninstall project'
                        bat 'helm install project .'
                        bat 'helm project .'
                        bat 'kubectl port-forward service/user-management-testing 3001:3001 & kubectl port-forward service user-management 3000:3000 &'
                    }       
                }
            }
        }

    }
}
