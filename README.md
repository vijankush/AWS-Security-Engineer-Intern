# AWS-Security-Engineer-Intern
![Nerve Center](https://drive.google.com/uc?export=view&id=1RPH5gVvkLIvdwNm2W5cIXxv_H7m-UbRr)

The Nerve Center was one of the biggest projects I worked on that involved taking logs of processes and transactions coming into AWS Kinesis, which I processed it to first convert it into a JSON file. JSON makes reading, parsing and analyzing data easier to make it work for SQL Queries.

Then I made something I call a scoring handler, that is basically every transaction or process that is successful gets a positive score, and every transaction or process with errors gets a negative score. Those scores are added to each object made in JSON.

Then all of this processed data is passed into an analytics application, where everything is grouped appropriately for storage and additional processing. All of this data from SQL is transferred into a database called DynamoDB, which basically stores all of this data in milliseconds and works really well on large-scale applications.

Next steps included making a slack integrated notification application, which basically works like this: if I see more than x amount of errors per unit of time from the same ip, it will send a notification to the company's slack channel using webhooks. In addition, then it does two things:
1. It puts the IP in our Firewall Blacklist using AWS Web Application Firewall
2. It creates a SQS queue that triggers after a specified time to tell AWS to unblock the IP.

Essentially, the ultimate goal is that once we have all this setup, we can use the built-in firewall to autonomously turn off access to those specific ip's that are potentially trying to infiltrate or hack our system.

***Cannot provide mock copies of the code due to security reasons**
