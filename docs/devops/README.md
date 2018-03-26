# Continuous Integration And Deployment

The nodejs application is using angular 4, so to build the interface the command `ng build` needs to be performes. But we have packaged the build script as [Gradle](https://gradle.org/) file.

## Setup gradle
The following steps were perform to build the CI:
```
$ touch build.gradle
$ gradle wrapper
$ ./gradlew properties
```
Then the build.gradle file create using the moowork node plugin so it can build nodejs app, use npm and ng build

```
plugins {
    id 'base'
    id "com.moowork.node" version "1.2.0"
}
```
Then the new tasks
```
task build(type: NpmTask) {
  args = ['run', 'build']
}

build.dependsOn(npm_install)
```

When running with `./gradlew build` will the first time do an npm install and then perform `ng build` to build the user interface.
