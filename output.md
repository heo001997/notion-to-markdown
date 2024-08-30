
# I. Introduction


Discover what this workshop is all about and the core-concepts behind it.


## Background & Objectives


Give it up for mentor Gia Hung and his First Cloud Journey team for a great [Site-to-Site VPN workshop](https://000003.awsstudygroup.com/1-introduce/).


Inheriting that spirit, we will have a similar tour about Site-to-Site VPN but to a lesser extent, where we will have fewer VPCs, Subnets, and EC2 instances.


We will provide an easier point of view for newcomers, focusing only on Site-to-Site VPN with the most reasonable cost possible.


Each piece of information is presented in bite-sized portions, making it easy to keep up with the guide without falling behind.


## Architecture Diagram


Take a first look at what we’ll build:


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/57a35495-f431-43ff-a13b-c130f4476d5e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=476e1f9eefa550671c05ca572f3fff91637462f4a84c20d319b5d0b6ab1a42c4&X-Amz-SignedHeaders=host&x-id=GetObject)


Diagram convention:


```bash
Example:
EC2 - AWS - EC2 Private
Private IP - 10.10.1.x

Explanation:
- The naming convention is always: <Service> - <Service Name>
Sample: EC2 - AWS - EC2 Private => <EC2> - <AWS - EC2 Private>

- Other lines represent properties:
Sample: Private IP - 10.10.1.x => <Properties>
```


That's everything. let's get it started.


# II. Prerequisites & Cost Estimation


In this section, we will lay the groundwork for the workshop by covering the necessary prerequisites and providing a detailed cost estimation, particularly with the AWS Free Tier in mind.


## 2.1. Prerequisites


In this workshop (WS), I’ll assume that you know how to find the corresponding actions. For example, in the image below, you know you can navigate to this screen by following the breadcrumb navigation.


Example: AWS search bar → VPC → Create VPC


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/41a12c32-2653-473d-80cc-09f6ca626354/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=af0c07b73ffd277df4308d21863bc9ff93bcfcc731d0b9f2ec85a31899a9ee63&X-Amz-SignedHeaders=host&x-id=GetObject)


Additionally, we won’t delve deeply into IAM and roles, so I’ll assume that you already have an IAM user with the **AdministratorAccess** permissions policy.


If you don’t know how to create one, you can refer to this workshop by Gia Hung and Hoang Kha: [https://000001.awsstudygroup.com/](https://000001.awsstudygroup.com/) :gratitude-clap:


## 2.2. Cost Estimation (Free Tier Version Included)


Since I’m using the AWS Free Tier for 12 months, this is my cost estimation.


I suggest that this lab should take a maximum of 1.5 hours to set up, test, and run everything.


I’m completely ignoring data costs because the data cost in this lab is VERY, VERY LITTLE (< $0.01).


I’ve optimized the order of enabling services to get the most cost-effective setup, so be very confident in following this workshop line by line.


This is the cost table for my workshop per lab.


| ID | Service                      | Pricing | Unit | Average Usage Time (hour) | Actual cost                 |
| -- | ---------------------------- | ------- | ---- | ------------------------- | --------------------------- |
| 1  | VPC                          | Free    | X    | X                         | $0.00                       |
| 2  | Subnet                       | Free    | X    | X                         | $0.00                       |
| 3  | Route Table                  | Free    | X    | X                         | $0.00                       |
| 4  | Security Group               | Free    | X    | X                         | $0.00                       |
| 5  | Internet Gateway             | Free    | X    | X                         | $0.00                       |
| 6  | Virtual Private Gateway      | Free    | X    | X                         | $0.00                       |
| 7  | Customer Gateway             | Free    | X    | X                         | $0.00                       |
| 8  | Elastic Compute Cloud (EC2)  | $0.0116 | 2    | 1.25 hour                 | $0.00 
(Free Tier Included) |
| 9  | Site-to-Site VPN Connections | $0.05   | 1    | 30                        | $0.025                      |


So, the final cost should be a maximum of **$0.025** for your total 1.5-hour usage time.


# III. Setup VPC AWS resources


These resources will act as a regular AWS cluster, I won’t set up anything related to the site-to-site connection yet.


## 1. VPC - AWS


First things first, fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/0b358095-e13a-4249-a669-84ca67515889/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=4adb50847ca429284c4b7529cfc930502dea75783dde3e1e006f90ec9ae1a1ce&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Subnet - AWS - Private subnet


Do the same as above: fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/56e9e409-a0cf-430c-8edb-6fa1c5d2c1d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=ed1bd8850239874bcf860311a3cf4a49097455c8e5b89f8ab4b62e7aac3ae135&X-Amz-SignedHeaders=host&x-id=GetObject)


## 3. Route Table - AWS - Private


Do the same as above: fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9f6ac04c-17fb-48fb-a54a-36d302b54876/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=dd7e9611a27c90c3f731f08715f475545d54f23ae8a59b81417641db4c3f608a&X-Amz-SignedHeaders=host&x-id=GetObject)


Add subnet association, this will allow the **Subnet - AWS - Private subnet** to follow the **Route Table - AWS - Private**’s routes.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/aeaee09f-7956-4b22-a1d2-b00c27230cc5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=68d6ddf34192f59a7f0f27963bb5d2aea37173c5a4bfb9f051d47c605cb0aba6&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d2e52df2-473b-4331-bde3-54b900286a86/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=e15a70e628f9b663dfda32c9ae7061f868d989d9169d004a716ab04a21a13c06&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/85d30a7b-e3e3-4900-aa65-c72d3c34953c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=951f279ffe8a6d44d1b239b731fc1c7fc4bf1a40929389c43ec9439d8089235f&X-Amz-SignedHeaders=host&x-id=GetObject)


## 4. Security Group - AWS - Private


Fill out the form and click "Create." This will **allow** other **EC2 instances** to **ping all EC2** **instances** in the Subnet - **AWS - Private subnet** if they can reach each other.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/5b59a42a-d43f-457e-abfb-6084a1b5a34b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=4db5cf30c260d0f59eb06622baa27f7d4298f09cb0b9a02b1c533be6dbd20f74&X-Amz-SignedHeaders=host&x-id=GetObject)


## 5. EC2 - AWS - EC2 Private


This form is quite long, so we will fill it out step by step.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/b5018226-36ec-4e95-a65c-6cf2a10e77aa/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=16666452786b2127da35532963b9ca1fbadf35c87a1395a43a70c14b45720cb8&X-Amz-SignedHeaders=host&x-id=GetObject)


Create a key pair to be able to SSH into **AWS - EC2 - Private** if you don’t already have one.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/b91c40ad-eb69-4175-8a44-2980d709c864/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=29519a18b45108b522abd978d650df808b332402efe35b1f5e33badd33e17537&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d8a694e6-9e80-4143-bf2f-de202544e9d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=ae1648dc6eefc0d268d9fac980e05cd3bd70ad52c081b688c47769eb233b16ce&X-Amz-SignedHeaders=host&x-id=GetObject)


After creating the key pair, you can select it now.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/f0770b20-a220-4560-8b7a-5ac33d96de85/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=38286f6f07c235b6d90c09f6bdb6ac1a33a39f5af24a621ee2eb4733c691644e&X-Amz-SignedHeaders=host&x-id=GetObject)


For network settings, we will edit them as follows:


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c595234b-dbdc-4f83-b684-4c350daca38e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=14640818ad8061199dc48ed15345103677d75f6baae78f0dd125170148f54f03&X-Amz-SignedHeaders=host&x-id=GetObject)


We can click "Launch Instance" now, leaving the other settings at their defaults is fine.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/79b9cff1-0e52-4a72-87af-dae0b5516d0d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=dfcc1e39ed382d33bc92b577914eb029c3755f4c3f980aa1368ba15916841520&X-Amz-SignedHeaders=host&x-id=GetObject)


Now, we’re done setting up the VPC AWS resources!


# IV. Setup VPC DC resources


Move on to this step, this will create resources to act as a regular on-premises data center. Like the previous step, I won’t set up anything related to the site-to-site connection yet.


## 1. VPC - DC


Fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/0d6aadf7-3b64-4164-9e03-6a82b8f04360/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=8814cdc1aed77ddac0282b702efaab15d34df8d22f6ba4a97f96ec153045ff2e&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Subnet - DC - Public subnet


Do the same as above: fill out the form and click "Create".


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/ec7238df-60d0-40b0-9d18-4168eb7c0421/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=cba1bbf8dba744f009b93ab2f5c52c4d272e9c4df65221fa2e15e8d589b1f060&X-Amz-SignedHeaders=host&x-id=GetObject)


## 3. Route Table - DC - Public


Do the same as above: fill out the form and click "Create".


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/51553b32-bb31-495a-8752-0d9b66fa1c49/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=f57aff5d5f5c22300c77178a699627fbe51368d50a36ca89bae9ce148e38a2b9&X-Amz-SignedHeaders=host&x-id=GetObject)


Associate this route with the **DC - Public subnet**.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/82961b2d-68e2-4632-908b-0b84c43007e8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=0317c6a573f06b3a00e1847225c023ad6ded9ad387c13da7fe00fa9f1ea9e9b9&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/de863335-49b5-4fd0-86b3-a2b0a61a5efd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=b3c51cdc9452e384660d91e86d1ea32d1df9607af492211fd4f5d7cd1b38a34a&X-Amz-SignedHeaders=host&x-id=GetObject)


## 4. Security Group - DC - Public


Fill out the form and click "Create." This will **allow** any client (computer, laptop, server, etc.) to **ping all EC2 instances** in the **Subnet - DC - Public** subnet if they can "see" each other.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/90ef2fd8-8309-4cdf-8a70-aff67ad95069/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=503d50eeb4d1d52f83fd396f028c86eb14f8db22394a69048ed644a83da5ea56&X-Amz-SignedHeaders=host&x-id=GetObject)


## 5. Internet Gateway - DC - IGW


Create an Internet Gateway - DC - IGW to allow the DC - VPC to connect to the internet.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/2dc2ede2-912f-4c54-983f-33230a1e25f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=0ed762ece92f1670a477f26f516c886d7e4d8556e3d63ccc7d25f583e5ec6d90&X-Amz-SignedHeaders=host&x-id=GetObject)


Attach it to **VPC - DC**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/bc9962b3-3b6b-4146-95ec-fa20b3e0417e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=9449aef561f36842a7215e387ed1dd26419533d8bbadf9f94872813d6d463f1f&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9d52f744-bcd0-419e-aef7-9cf1383ae06d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=4d76e627531903a0aa9deb3b830dc1cdc2d73a4b771698ae8e7f273c99ed0102&X-Amz-SignedHeaders=host&x-id=GetObject)


Go back to the Route Table and edit it to accept the attached Internet Gateway.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/df0364d1-faff-4346-a66f-bd7c3f361296/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154245Z&X-Amz-Expires=3600&X-Amz-Signature=dc7d5ef33083fff3f9a4cc0044b98b3ec541ba7a9fe7d7165f6679ba34f21baa&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/8d516c8e-c307-4d41-8060-10080477035f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=2f4b1f9c4f5c112cbff5504177d0349b71e6702b856a4f4bbeca595c95d4e80a&X-Amz-SignedHeaders=host&x-id=GetObject)


The route should look like this


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/950790c5-069b-4222-9591-a8819bd38aa7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=5b2f51f6c542f91ba33101210e849bb7a5de7b70d35db10edf691caa07203020&X-Amz-SignedHeaders=host&x-id=GetObject)


## 6. EC2 - DC - EC2 Openswan Gateway


### 6.1 Create DC - EC2 Openswan Gateway


This form is quite long, so we will fill it out step by step.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/68379cf6-81c1-4bdd-b50c-97f882a75c39/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=ca8755de98f52806047139b988b5db00f185d78a6eaa058350636822a450634a&X-Amz-SignedHeaders=host&x-id=GetObject)


Create a key pair to be able to SSH into AWS - EC2 - Private if you don’t already have one.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3e8f3b13-abe4-476a-9702-c922dd617d30/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=8d0dba1ae4b353c0cb41e74b01a8ad9a3d11382181e006bc38d4c4ab36e27176&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/2de80525-c893-42fc-babd-52d67f9add5b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=799c503d0b21cde48ad504a80c7c58e564f5ec1ae914aa2dcf33dfcc25cf3023&X-Amz-SignedHeaders=host&x-id=GetObject)


Select the newly created key pair.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/19e053e9-2c19-4295-9a2f-b7329afb1be8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=b1217c82ecd06d7098f98eb15506f0c51dd0184b1846901ae59bbbb45cade02c&X-Amz-SignedHeaders=host&x-id=GetObject)


Edit Network like this


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3b2c7b64-dabe-43be-9af1-318c8bab86cc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=1b3e28d6f217e8b75f10603ebe21aef86e67b14b3d91a2f0fc6d6e4279259ed5&X-Amz-SignedHeaders=host&x-id=GetObject)


We can click "Launch Instance" now, leaving the other settings at their defaults is fine.


### 6.2 Verify SSH-able from MyIP


Let’s go to the Instance Details, you can see that DC - EC2 Openswan Gateway is already up with a Public IPv4 address.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/79c40755-2a43-4aa6-a1c5-d8aefe0fd69c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=4014269cf2f39d9aac86b83323b993537df1a9aec39398cc4f678beeac43051f&X-Amz-SignedHeaders=host&x-id=GetObject)


Open your terminal and connect via SSH to the **DC - EC2 Openswan Gateway** using the `dc-ec2-openswan-gateway.pem` file we already downloaded.


Note: Lines preceded by ‘#’ are comments, so you don’t have to run those commands in the terminal.


```bash
# Modify keypair permission (required by AWS)
Format:
chmod 400 <path to the dc-ec2-openswan-gateway.pem key>

Example - my filled command:
chmod 400 Downloads/dc-ec2-openswan-gateway.pem


# Start SSH
Format:
ssh -i <path to the dc-ec2-openswan-gateway.pem key> ec2-user@<Public IPv4>

Example - my filled command:
ssh -i Downloads/dc-ec2-openswan-gateway.pem ec2-user@54.85.149.143
```


I can SSH into the **DC - EC2 Openswan Gateway** from my local computer now.


```bash
 ~  ssh -i Downloads/dc-ec2-openswan-gateway.pem ec2-user@54.85.149.143                                                                                 ✔ │ 3.3.0  │ 12:14:37 AM 
   ,     #_
   ~\_  ####_        Amazon Linux 2
  ~~  \_#####\
  ~~     \###|       AL2 End of Life is 2025-06-30.
  ~~       \#/ ___
   ~~       V~' '->
    ~~~         /    A newer version of Amazon Linux is available!
      ~~._.   _/
         _/ _/       Amazon Linux 2023, GA and supported until 2028-03-15.
       _/m/'           https://aws.amazon.com/linux/amazon-linux-2023/

[ec2-user@ip-192-168-1-206 ~]$ whoami
ec2-user

```


### 6.3 Verify internet connection and DNS resolution


Try to ping AWS


```bash
ping amazon.com -c5
```


It’s all good


```bash
[ec2-user@ip-192-168-1-206 ~]$ ping amazon.com -c5
PING amazon.com (54.239.28.85) 56(84) bytes of data.
64 bytes from 54.239.28.85 (54.239.28.85): icmp_seq=1 ttl=250 time=1.25 ms
64 bytes from 54.239.28.85 (54.239.28.85): icmp_seq=2 ttl=250 time=0.667 ms
64 bytes from 54.239.28.85 (54.239.28.85): icmp_seq=3 ttl=250 time=0.974 ms
64 bytes from 54.239.28.85 (54.239.28.85): icmp_seq=4 ttl=250 time=0.976 ms
64 bytes from 54.239.28.85 (54.239.28.85): icmp_seq=5 ttl=250 time=1.34 ms

--- amazon.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4017ms
rtt min/avg/max/mdev = 0.667/1.043/1.340/0.238 ms
```


In case your ping fails, try the command below and ping again.


```bash
# This should resolve the DNS problem
sudo sh -c "echo nameserver 1.1.1.1 > /etc/resolv.conf"
```


# IV. Prepare for Site-to-Site VPN - AWS to DC


## 1. Virtual Private Gateway - AWS - PGW


Create a new Virtual Private Gateway - **AWS - PGW**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/330d9412-b5e2-41c2-86ba-66c9f4fa82d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=102b5fd453283bf38d982963999f95c403de2a3357c5b9116b334b8ea307a03d&X-Amz-SignedHeaders=host&x-id=GetObject)


Refresh the page if it says "Success" but shows nothing.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d3b02044-81aa-4990-af24-c7140f784c21/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=770a2b0686e5d19dfed9ab6be33ee653812a0236c09953ca608bdf6027e96479&X-Amz-SignedHeaders=host&x-id=GetObject)


Select and attach it to **VPC - AWS**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c4bb2bf1-9956-42f9-8d1a-6319b893192e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=6c7c13cc79b82f3952f5e93b8bc372891df1833f649e3f94acc8c9ebe82194a0&X-Amz-SignedHeaders=host&x-id=GetObject)


Edit the Route Table - **AWS - Private** so it can route traffic from this VGW.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3e4acad0-4c0e-4f11-86b1-bd63fb30145d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=c3c10faa9496e12645193e6d77b8086cc7fb041ebe90647cec59f1e7adb50bff&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/424b778e-2ce9-487e-99e5-b179a35f49d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=51741607d49e59ff3bea2ae9abe339d5c84d2d6a02f81efb2233464d1a019bcb&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/5c412718-7ea4-47b9-b63b-6b0c0f33ebc7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=e33b09c7d5749afef1870fc1ca819e631417005bf0fcb3066929b2e9cb9bad6b&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Customer Gateway - DC - CGW


Create a Customer Gateway, this will be used for the Site-to-Site connection to identify which customer gateway it will connect to.


The **IP address** is your **DC - EC2 - Openswan Gateway IPv4 Public Address** (the same one we used for the SSH check).


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/fb430193-1289-4cd2-86d0-857538ce770e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=1fcfa50c8e6f69235a8c865bc0985e568cf80f71caba83813a8614dd2fc8da45&X-Amz-SignedHeaders=host&x-id=GetObject)


# V. Site-to-Site VPN - AWS to DC


## 1. Setup Site-to-Site VPN - AWS to DC


Fill out the form as follows, with explanations:

1. **Static IP Prefixes:** You will need to fill in two CIDRs. The first is our **VPC - DC (192.168.0.0/16)**, and the second is **VPC - AWS (10.10.0.0/16)**.
2. **Local IPv4 Network CIDR:** Fill in our **VPC - DC** CIDR **(192.168.0.0/16)**.
3. **Remote IPv4 Network CIDR:** Fill in our **VPC - AWS** CIDR **(10.10.0.0/16)**.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9d504ed3-e661-48c3-bdad-49e63cd32849/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=df095aaa737d48714bbb4824253936c7ab7e48fb9e8b80397a8ce97ce89a028b&X-Amz-SignedHeaders=host&x-id=GetObject)


That’s everything, click "Create" You should see the new VPN connection from **AWS to DC**. We will move on to the next step while waiting for this VPN to be ready.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a1e2e5d9-c7f5-4910-9e33-66561c005baf/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=d1ef48070b05710b9413779d8b990557e6f52483386d9e81a2b6fa802c391148&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Setup Openswan on EC2 - DC - EC2 Openswan Gateway


Click "Download Configuration" We will use this configuration to set up our Openswan gateway.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/6f70348e-d33e-45dd-8a40-a1f9bb8e07e5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=fabc1e7a3aa8a02130fd9c3e3fedbd1e4e8652754be3cfe21222af0cbdc1f949&X-Amz-SignedHeaders=host&x-id=GetObject)


Select the options as shown, and click "Download"


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a86bca94-8776-41fb-b791-37ad1ceeea70/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=a1393356b4c40938777cc2eda4ea175021db349872bf7cfeafd6f26e13edd107&X-Amz-SignedHeaders=host&x-id=GetObject)


Open that file, and you can see all the instructions. You can read it to learn more details.


For now, let’s focus on certain parts of the `IPSEC Tunnel #1` configuration, such as `conn` and `secrets`, as shown below:


```bash
---
IPSEC Tunnel #1
---
...
conn Tunnel1
	authby=secret
	auto=start
	left=%defaultroute
	leftid=54.85.149.143
	right=3.225.20.219
	type=tunnel
	ikelifetime=8h
	keylife=1h
	phase2alg=aes128-sha1;modp1024
	ike=aes128-sha1;modp1024
	auth=esp
	keyingtries=%forever
	keyexchange=ike
	leftsubnet=<LOCAL NETWORK>
	rightsubnet=<REMOTE NETWORK>
	dpddelay=10
	dpdtimeout=30
	dpdaction=restart_by_peer
...
5) Create a new file at /etc/ipsec.d/aws.secrets if it doesn't already exist, and append this line to the file (be mindful of the spacing!):
54.85.149.143 3.225.20.219: PSK "yioHTXdE29JV2HmcDpx8nXhzQwkdR5FW"
...
```


We’ll need to use these two configurations/credentials, and we will build the command to add the `conn` configuration as follows:

1. Remove `auth=esp` to avoid conflicts with the Amazon Linux 2 AMI - VPN configuration.
2. Update `leftsubnet=192.168.0.0/16` to match the current **VPC - DC** CIDR (Local).
3. Update `rightsubnet=10.10.0.0/16` to match the current VPC **VPC - AWS** CIDR (Remote).
4. Keep everything else in the configuration the same.

So my `add conn` command will look like this:


```bash
sudo bash -c 'cat <<EOF > /etc/ipsec.d/aws.conf
conn Tunnel1
  authby=secret
  auto=start
  left=%defaultroute
  leftid=54.85.149.143
  right=3.225.20.219
  type=tunnel
  ikelifetime=8h
  keylife=1h
  phase2alg=aes128-sha1;modp1024
  ike=aes128-sha1;modp1024
  keyingtries=%forever
  keyexchange=ike
  leftsubnet=192.168.0.0/16
  rightsubnet=10.10.0.0/16
  dpddelay=10
  dpdtimeout=30
  dpdaction=restart_by_peer
EOF'
cat /etc/ipsec.d/aws.conf
```


Next step, look at the remaining parts of the downloaded configuration file.


```bash
5) Create a new file at /etc/ipsec.d/aws.secrets if it doesn't already exist, and append this line to the file (be mindful of the spacing!):
54.85.149.143 3.225.20.219: PSK "yioHTXdE29JV2HmcDpx8nXhzQwkdR5FW"
```


We will build our `add secret` command by inserting the key in the middle of this command.


```bash
sudo bash -c 'cat <<EOF > /etc/ipsec.d/aws.secrets
54.85.149.143 3.225.20.219: PSK "yioHTXdE29JV2HmcDpx8nXhzQwkdR5FW"
EOF'
cat /etc/ipsec.d/aws.secrets
```


Nice! Now SSH into **DC - EC2 - Openswan Gateway** again. We will follow a series of steps to set up Openswan.


```bash
# Change to su user, we will have full permissions to run all commands
sudo su

# Install openswan
yum install openswan -y

# Edit `/etc/sysctl.conf` to avoid redirect attach
sudo bash -c 'cat <<EOF > /etc/sysctl.conf
net.ipv4.ip_forward = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
EOF'
cat /etc/sysctl.conf

# Run the `add conn command` that you just built
# This is my `add conn command` command, remember to run YOUR instead
sudo bash -c 'cat <<EOF > /etc/ipsec.d/aws.conf
conn Tunnel1
  authby=secret
  auto=start
  left=%defaultroute
  leftid=54.85.149.143
  right=3.225.20.219
  type=tunnel
  ikelifetime=8h
  keylife=1h
  phase2alg=aes128-sha1;modp1024
  ike=aes128-sha1;modp1024
  keyingtries=%forever
  keyexchange=ike
  leftsubnet=192.168.0.0/16
  rightsubnet=10.10.0.0/16
  dpddelay=10
  dpdtimeout=30
  dpdaction=restart_by_peer
EOF'
cat /etc/ipsec.d/aws.conf

# Run the `add secret command` that you just built
# This is my `add secret command` command, remember to run YOUR instead
sudo bash -c 'cat <<EOF > /etc/ipsec.d/aws.secrets
54.85.149.143 3.225.20.219: PSK "yioHTXdE29JV2HmcDpx8nXhzQwkdR5FW"
EOF'
cat /etc/ipsec.d/aws.secrets

# Apply new config and restart **Network service & IPsec service**
sudo sysctl -p # Apply new sysctl config
sudo chkconfig ipsec on # Ensures IPsec service is enabled on boot.
sudo service network restart
sudo service ipsec restart

# Read IPsec log 
sudo journalctl -u ipsec -f

```


Check if IPsec has started yet


```bash
# Check IPsec and network status
sudo service ipsec status
```


Mine is good now, you can see it shows `Active: active (running)`


```bash
[root@ip-192-168-1-206 ec2-user]# sudo service ipsec status 
Redirecting to /bin/systemctl status ipsec.service
● ipsec.service - Internet Key Exchange (IKE) Protocol Daemon for IPsec
   Loaded: loaded (/usr/lib/systemd/system/ipsec.service; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2024-08-27 18:16:26 UTC; 35s ago
     Docs: man:ipsec(8)
           man:pluto(8)
           man:ipsec.conf(5)
  Process: 1168 ExecStartPre=/usr/sbin/ipsec --checknflog (code=exited, status=0/SUCCESS)
  Process: 1162 ExecStartPre=/usr/sbin/ipsec --checknss (code=exited, status=0/SUCCESS)
  Process: 628 ExecStartPre=/usr/libexec/ipsec/_stackmanager start (code=exited, status=0/SUCCESS)
  Process: 626 ExecStartPre=/usr/libexec/ipsec/addconn --config /etc/ipsec.conf --checkconfig (code=exited, status=0/SUCCESS)
 Main PID: 1186 (pluto)
   Status: "Startup completed."
   CGroup: /system.slice/ipsec.service
           └─1186 /usr/libexec/ipsec/pluto --leak-detective --config /etc/ipsec.conf --nofork

Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: | setup callback for interface eth0:500 fd 15
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: loading secrets from "/etc/ipsec.secrets"
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: loading secrets from "/etc/ipsec.d/aws.secrets"
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #1: initiating Main Mode
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #1: STATE_MAIN_I2: sent MI2, expecting MR2
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #1: STATE_MAIN_I3: sent MI3, expecting MR3
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #1: Peer ID is ID_IPV4_ADDR: '3.225.20.219'
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #1: STATE_MAIN_I4: ISAKMP SA established {auth=PRESHARED_KEY cipher=aes_128 integ=sha group=MODP1024}
Aug 27 18:16:26 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #2: initiating Quick Mode PSK+ENCRYPT+TUNNEL+PFS+UP+IKEV1_ALLOW+IKEV2_ALLOW+SAREF_TRACK+IKE_FRAG_AL...=MODP1024}
Aug 27 18:16:27 ip-192-168-1-206.ec2.internal pluto[1186]: "Tunnel1" #2: STATE_QUICK_I2: sent QI2, IPsec SA established tunnel mode {ESP/NAT=>0xc4f820fd <0x5b2d1f92 xfr...PD=active}
Hint: Some lines were ellipsized, use -l to show in full.
```


## 2. Verify connection from EC2 Openswan Gateway to AWS - EC2 Private


Double-check if it’s truly connected to **AWS - EC2 Private’s** Private IPv4.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/bc63c416-3600-4e66-8053-75229d7f0d4b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=5553306357c1d90512eb81d8499fa2ebfd85c4fcaf83ca133e52a46279e6c5ce&X-Amz-SignedHeaders=host&x-id=GetObject)


```bash
ping 10.10.1.141 -c5
```


It’s ok now


```bash
[root@ip-192-168-1-206 ec2-user]# ping 10.10.1.141 -c5
PING 10.10.1.141 (10.10.1.141) 56(84) bytes of data.
64 bytes from 10.10.1.141: icmp_seq=1 ttl=254 time=1.86 ms
64 bytes from 10.10.1.141: icmp_seq=2 ttl=254 time=1.83 ms
64 bytes from 10.10.1.141: icmp_seq=3 ttl=254 time=1.53 ms
64 bytes from 10.10.1.141: icmp_seq=4 ttl=254 time=2.07 ms
64 bytes from 10.10.1.141: icmp_seq=5 ttl=254 time=1.67 ms

--- 10.10.1.141 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4007ms
rtt min/avg/max/mdev = 1.532/1.796/2.079/0.193 ms
```


If we can ping, then Tunnel 1 in the VPN connection details must be Up. If the status is still Down for both tunnels, it’s likely because it takes some time to re-check the connection.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/7368c218-edee-4463-86ec-37f1251732cb/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=cf3dd3d1af7a4b2d6d0a2d2f1387f2fba3bcff1b3d9ddfdf71e11041a9eee3e3&X-Amz-SignedHeaders=host&x-id=GetObject)


In this workshop, I’ll only use one tunnel, because with my current Static IP VPN connection strategy, it would cause **random asymmetric routing** if I use 2 tunnels in my VPN. You can still use 2 tunnels and avoid this issue by using a Dynamic IP (try it if you’re a curious cat).


## 3. Test SSH from DC - EC2 Openswan Gateway to AWS - EC2 Private


First, we edit the Security Group - **AWS - Private** to allow SSH from **DC - EC2 Openswan Gateway**.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/255fe5cf-8ee6-4d87-8eb9-5e7bef5c3843/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154246Z&X-Amz-Expires=3600&X-Amz-Signature=90aaa4597c54c6341374f308ea737d72b857d4387980303f59cc7665bc3d3006&X-Amz-SignedHeaders=host&x-id=GetObject)


Fill in the IPv4 Private address of **DC - EC2 Openswan Gateway** with a subnet mask of /32.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/59471b7d-398e-4600-b61a-6f1de86abd3a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=7fedc20972b153bddc59014f1b9d1a08769778f2a15d8903b21084c25eedd1be&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c9c35b04-9b5e-4767-bee5-b8457fe57dee/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=7b33fcd57d006f5670420349209b1ee1ae8ce41738d59c55594f92e28243527c&X-Amz-SignedHeaders=host&x-id=GetObject)


Now we’re allowed to SSH into **AWS - Private** if the connecting IP matches.


If you’re wondering why it’s an **IPv4 Private** address, it’s because the VPN connection is already set up. The two servers now think they’re on the same network, they no longer consider themselves connected through the internet, so they use IPv4 Private addresses to connect.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/09747000-41dd-49e7-ad83-b1ab40f340c7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=d745dd3f75bde34da89ff64dce4bdd1c666b9dff54faeaea55199274e90c8354&X-Amz-SignedHeaders=host&x-id=GetObject)


If we want SSH to be possible, we will need to transfer the **AWS - EC2 Private** key (`aws-ec2-private.pem`) from our local machine to **DC - EC2 Openswan Gateway**.


```bash
# Modify keypair permission (required by AWS)
Format:
chmod 400 <path to the aws-ec2-private.pem key>

Example - my filled command:
chmod 400 Downloads/aws-ec2-private.pem


# Copy the key from local machine to DC - EC2 Openswan Gateway
Format:
scp -i <path to the dc-ec2-openswan-gateway.pem key> <path to the aws-ec2-private.pem key> ec2-user@<Public IPv4> 

Example - my filled command:
scp -i Downloads/dc-ec2-openswan-gateway.pem Downloads/aws-ec2-private.pem ec2-user@54.85.149.143:/home/ec2-user/ 
```


It looks like this if your copy is successful.


```bash
 ~  scp -i Downloads/dc-ec2-openswan-gateway.pem Downloads/aws-ec2-private.pem ec2-user@54.85.149.143:/home/ec2-user/                               INT ✘ │ 3.3.0  │ 01:40:24 AM 
aws-ec2-private.pem     100% 1678     6.4KB/s   00:00    
```


SSH again into **DC - EC2 Openswan Gateway** (use your previous command, I won’t rewrite the instructions here).


Type `ls` to show all files. You should see the key to SSH into **AWS - EC2 Private** there.


```bash
[ec2-user@ip-192-168-1-206 ~]$ ls
aws-ec2-private.pem
```


Run the SSH command now


```bash
# Modify keypair permission (required by AWS)
Format:
ssh -i aws-ec2-private.pem ec2-user@<AWS - EC2 Private - Private IPv4>

Example - my filled command:
ssh -i aws-ec2-private.pem ec2-user@10.10.1.141
```


I can SSH into **DC - EC2 Openswan Gateway** from my local computer now.


```bash
[ec2-user@ip-192-168-1-206 ~]$ ssh -i aws-ec2-private.pem ec2-user@10.10.1.141
Last login: Tue Aug 27 18:52:11 2024 from 192.168.1.206
   ,     #_
   ~\_  ####_        Amazon Linux 2
  ~~  \_#####\
  ~~     \###|       AL2 End of Life is 2025-06-30.
  ~~       \#/ ___
   ~~       V~' '->
    ~~~         /    A newer version of Amazon Linux is available!
      ~~._.   _/
         _/ _/       Amazon Linux 2023, GA and supported until 2028-03-15.
       _/m/'           https://aws.amazon.com/linux/amazon-linux-2023/

[ec2-user@ip-10-10-1-141 ~]$ who
ec2-user pts/0        2024-08-27 19:00 (192.168.1.206)
```


# VI. Conclusion


Voila! What a journey!


In this workshop, we’ve tackled everything—from architecting an overview to cost estimating, setting up preconditions, configuring, and verifying...


Even though this workshop was relatively straightforward, I believe we had a lot of fun tinkering, scripting, and completing all the tasks.


I’m thrilled to have been here with you today, and I hope you enjoyed the experience as much as I did. ❤️


See you in the next workshop!


BUT DON’T FORGET TO CLEAN UP YOUR STUFF! :)))


# VII. Clean it up!!!


## 1. Goodbye EC2 instances


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/40a8a6d1-b96a-4478-94f9-eb873193f17d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=cb716b583b1c373df7fc5a3b9f1815f4d790c3ebf1d61dc07f98ac6738202343&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Goodbye VPCs


Delete VPCs with subnet too, nice


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/618c1bc8-bfca-4ac3-b618-580693b743da/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=a6f5429b1eac10df12a7900351b4696b3457451c3a1b25ccac5e735e8301e9d6&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/60597ad3-2ee6-4d68-8341-5902d90e8410/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=cd6bd30d5dfd17860a6cd86e1841b701ecf7df26e62e71e09f889426996ffaf9&X-Amz-SignedHeaders=host&x-id=GetObject)


Delete AWS with it’s Subnet too


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a817720f-db1b-4240-a287-28d3b163e440/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=e01d0d35daa74275c381aabce06524f3f04553ad0277e962d3637e5cf3b66eb0&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Goodbye Subnets


Should be auto deleted when VPC deleted


## 3. Goodbye Route Tables


Should be auto deleted when VPC deleted


## 4. Goodbye Security Groups


Should be auto deleted when VPC deleted


## 5. Goodbye Internet Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/dc4fef95-50e6-4092-94a4-ec4323ad522c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=0c2537fae6c6315a643e22a0f67474c6a9a410fde9f0d5002de6b1a1b7ae4b7f&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/e837f1d0-b72f-4b3d-96b6-a8742780d449/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=8a7a2cd7124a3ea88604ad3c2814904ee1054936d685bb2507f598e7a3aec025&X-Amz-SignedHeaders=host&x-id=GetObject)


## 6. Goodbye Setup Site-to-Site VPNs


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/43701e60-6c41-4c79-a14b-1a5fc04e3208/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=50a2143677178b9b30e573201732589f1915fdd7ed7793bd8dd59f9fd9073efe&X-Amz-SignedHeaders=host&x-id=GetObject)


## 7. Goodbye Virtual Private Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/28c08793-79ca-49be-84be-b1eb187d404c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=9f428fb659546dc42bbab51a7453acaa9adfd654842fde005677a92d6ee82b51&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/32186cb5-6071-4c7b-9e1c-33f89f69207a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=72d2cfcf1afb34cdd5803b052add6613c939908a95dba2126d7e7c0ad0ae92eb&X-Amz-SignedHeaders=host&x-id=GetObject)


## 8. Goodbye Customer Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/fe6ae0bb-7412-4111-8fdb-b061543f5331/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240829%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240829T154247Z&X-Amz-Expires=3600&X-Amz-Signature=1a52c956821266dfde94430a448d70e8e4730838cf901c0e0e84d7c22d22cec3&X-Amz-SignedHeaders=host&x-id=GetObject)


We’re now as clean as a whistle. 

