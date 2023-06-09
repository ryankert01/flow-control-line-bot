# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your application listens
ENV PORT=3000
EXPOSE $PORT

# Define the command to run your application
CMD [ "npm", "start" ]
