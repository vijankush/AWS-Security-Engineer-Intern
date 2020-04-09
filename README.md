# AWS-Security-Engineer-Intern
This folder consists of mock projects and AWS tools that I have utilized throughout my Security Engineer Internship at Handle Financial, a fintech startup.

One of my biggest project involved taking logs of processes and transactions coming into AWS Kinesis, which I processed it to first convert it into a JSON file. JSON makes reading, parsing and analyzing data easier. 

Then I made something I call a scoring handler, that is basically every transaction or process that is successful gets a positive score, and every transaction or process with errors gets a negative score. Those scores are added to each object made in JSON.

Then all of this processed data is passed into an analytics application, where everything is grouped by ip address, timestamp, positive score, negative score, and a count of number of times we have seen the same ip address -> and all of this data from SQL is transferred into a database called DynamoDB, which basically stores all of this data in milliseconds and works really well on large-scale applications.

Next steps included making a slack integrated notification application, which basically works like this: if I see more than x amount of errors per unit of time from the same ip, it will send a notification to the security sandbox slack channel. Essentially, the ultimate goal is that once we have all this setup, we can use the built-in firewall to autonomously turn off access to those specific ip's that are potentially trying to infiltrate or hack our system.
