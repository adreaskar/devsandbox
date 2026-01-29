#!/bin/bash
set -e

# Clone GitHub repository if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  cd /home/javauser/workspace
  if git clone "$GIT_REPO_URL" github-repo; then
    echo "Repository cloned successfully"
    cd github-repo
  else
    echo "Failed to clone repository, continuing with empty workspace"
  fi
else
  # Create a Java Hello World boilerplate if no repository is provided
  echo "No repository provided. Creating Java Hello World boilerplate..."
  cd /home/javauser/workspace
  
  # Create project directory
  mkdir -p hello-world/src/main/java/com/example
  cd hello-world
  
  # Create pom.xml for Maven
  cat > pom.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>hello-world</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
        </plugins>
    </build>
</project>
EOF
  
  # Create Main.java with HTTP server
  cat > src/main/java/com/example/Main.java << 'EOF'
package com.example;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);
        
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String response = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Java Hello World</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 50px; }
                            h1 { color: #007396; }
                        </style>
                    </head>
                    <body>
                        <h1>Hello, World! ☕</h1>
                        <p>Welcome to your Java workspace!</p>
                        <p>This is a simple HTTP server built with Java 21.</p>
                    </body>
                    </html>
                    """;
                
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });
        
        server.setExecutor(null);
        server.start();
        System.out.println("🚀 Java HTTP server running on http://localhost:8081");
        System.out.println("Press Ctrl+C to stop");
    }
}
EOF
  
  echo "Java Hello World project created successfully!"
  echo "To compile and run the application:"
  echo "  cd hello-world"
  echo "  mvn compile"
  echo "  mvn exec:java -Dexec.mainClass=\"com.example.Main\""
  echo "Or simply:"
  echo "  javac -d target/classes src/main/java/com/example/Main.java"
  echo "  java -cp target/classes com.example.Main"
fi

# Start code-server
echo "Starting code-server..."
exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --user-data-dir /home/javauser/.vscode-settings \
  --extensions-dir /home/javauser/.vscode-extensions \
  --disable-telemetry \
  --auth none \
  /home/javauser/workspace
