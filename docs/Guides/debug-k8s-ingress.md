The service selector should match at least 1 pod label and deployment 
Service Target port should match the container port of the pod
the service port can be any number
The deployment metadata -> label is not used by the service
deployment -> selector -> match label and deployment -> template -> metadata -> labels 
