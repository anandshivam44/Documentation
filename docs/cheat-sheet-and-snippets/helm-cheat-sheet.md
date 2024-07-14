## Helm Cheat Sheet  

#### List Installed Helm Charts
```bash
#List Installed Helm Charts in current
helm ls 
# or
helm list

# List Installed Helm Charts from all namespace
helm ls -aA
helm list --all-namespaces

#List Installed Helm Charts in specific namespace
helm ls -n cert-manager
```
#### Helm find erors in helm syntax
```bash
helm lint my-chart-folder
```
#### Helm install charts
```bash
#Run a test installation to validate and verify the chart:
# add --dry-run --debug in any helm install command
helm install [release-name] ./my-chart-directory --dry-run --debug

#Install a chart from a local directory
helm install release-name ./my-chart-directory

# Install a chart from a remote repository
helm install my-release stable/mysql

# Install a chart with custom configuration values
helm install my-release stable/mysql --set mysqlRootPassword=secretpassword

# Install a release in a specific namespace
helm install -name release-name charts-name --namespace sample
```
#### Upgrading Helm Charts
To upgrade a Helm chart to a new version or with updated configuration, you can use the helm upgrade command.
```bash
# basic
helm upgrade [release] [chart]
helm upgrade -name helm-release-name helm-charts-path
helm upgrade -name helm-release-name helm-charts-path --namespace sample

#Instruct Helm to rollback changes if the upgrade fails:
helm upgrade [release] [chart] --atomic

#Upgrade a release. If it does not exist on the system, install it
helm upgrade [release] [chart] --install

#Upgrade to a specified version
helm upgrade [release] [chart] --version [version-number]
```
#### Uninstall helm chart
To uninstall a Helm chart and delete the associated resources from your Kubernetes cluster, you can use the helm uninstall command
```bash
helm uninstall [release]
# Example
helm uninstall helm-release-name -n sample-namespace
```
#### helm Override the default values from a file
```bash
helm install [app-name] [chart] --values [yaml-file/url]
helm install -name helm-release-name helm-charts --namespace sample --values helm-charts/values-dev.yaml
helm install -name helm-release-name helm-charts --namespace sample --values helm-charts/values-test.yaml
helm install -name helm-release-name helm-charts --namespace sample --values helm-charts/values-prod.yaml
```
#### helm repo list
```bash
helm repo list
```
#### Update list of Helm charts from repositories
```bash
helm repo update
```
#### Search Helm Hub
```bash
helm search hub wordpress 
helm search hub prometheus
```
#### Add a repository
```bash
helm repo add [repository-name] [url]
helm repo add bitnami https://charts.bitnami.com/bitnami
```
#### Remove a repository from your system
```bash
helm repo remove [repository-name]
helm repo remove bitnami
```
#### Display the chart’s values
```bash
helm show values my-charts
```
#### Download a chart
```bash
helm pull my-charts
```
#### Display a list of a chart’s dependencies
```bash
helm dependency list my-charts
```






