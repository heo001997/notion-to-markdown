
# I. Introduction


Discover what this workshop is all about and the core-concepts behind it.


## Background & Objectives


Give it up for mentor Gia Hung and his First Cloud Journey team for a great [Site-to-Site VPN workshop](https://000003.awsstudygroup.com/1-introduce/).


Inheriting that spirit, we will have a similar tour about Site-to-Site VPN but to a lesser extent, where we will have fewer VPCs, Subnets, and EC2 instances.


We will provide an easier point of view for newcomers, focusing only on Site-to-Site VPN with the most reasonable cost possible.


Each piece of information is presented in bite-sized portions, making it easy to keep up with the guide without falling behind.


## Architecture Diagram


Take a first look at what we’ll build:


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/57a35495-f431-43ff-a13b-c130f4476d5e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150400Z&X-Amz-Expires=3600&X-Amz-Signature=8f8abea005cdf885a4236af70632449d8c05c999dbcc96f81d1b054d7e7a40ae&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/41a12c32-2653-473d-80cc-09f6ca626354/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150400Z&X-Amz-Expires=3600&X-Amz-Signature=4c8da4e8f00c219523994018e67905b3629de3fe375042f320c177eadb6228ec&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/0b358095-e13a-4249-a669-84ca67515889/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150400Z&X-Amz-Expires=3600&X-Amz-Signature=77669aa025097c3074ac5e272cce5efd076c0bd6cce550562a3ce3c8cac51078&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Subnet - AWS - Private subnet


Do the same as above: fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/56e9e409-a0cf-430c-8edb-6fa1c5d2c1d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150400Z&X-Amz-Expires=3600&X-Amz-Signature=e634f0b6b8f90310e7c86240ba2b58325e32ff8eae48532629ee0ccda1dd1dd4&X-Amz-SignedHeaders=host&x-id=GetObject)


## 3. Route Table - AWS - Private


Do the same as above: fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9f6ac04c-17fb-48fb-a54a-36d302b54876/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150400Z&X-Amz-Expires=3600&X-Amz-Signature=88fedda77f07e484974886f0e30b35a4bcaef2b9ec347fe86b51d369a6b3ea06&X-Amz-SignedHeaders=host&x-id=GetObject)


Add subnet association, this will allow the **Subnet - AWS - Private subnet** to follow the **Route Table - AWS - Private**’s routes.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/aeaee09f-7956-4b22-a1d2-b00c27230cc5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=b8643a4a696f0b8006690733dd0151adee906ffd922b79d5a066f2a01ade3ad7&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d2e52df2-473b-4331-bde3-54b900286a86/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=97c51a83f0e9306f877f8282ab8112f2adf93360d05007a87bd9018efc1ad06f&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/85d30a7b-e3e3-4900-aa65-c72d3c34953c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=4989809bee7bfd1fae1aaef2760926346f2f8319ed17a1ce3e830f9f3cd772b5&X-Amz-SignedHeaders=host&x-id=GetObject)


## 4. Security Group - AWS - Private


Fill out the form and click "Create." This will **allow** other **EC2 instances** to **ping all EC2** **instances** in the Subnet - **AWS - Private subnet** if they can reach each other.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/5b59a42a-d43f-457e-abfb-6084a1b5a34b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=b409527e7b99c26556b48c79f86704211d6c990cb2533cd0426a3ac407932bd4&X-Amz-SignedHeaders=host&x-id=GetObject)


## 5. EC2 - AWS - EC2 Private


This form is quite long, so we will fill it out step by step.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/b5018226-36ec-4e95-a65c-6cf2a10e77aa/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=65b116802895da3a0504e1be441c43b803c33b3f999c338e080a3a031f1f8393&X-Amz-SignedHeaders=host&x-id=GetObject)


Create a key pair to be able to SSH into **AWS - EC2 - Private** if you don’t already have one.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/b91c40ad-eb69-4175-8a44-2980d709c864/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=2c2793850bb605e0b2122a5373336bfe9abb0039564a3f8048aa07f3ec5281c2&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d8a694e6-9e80-4143-bf2f-de202544e9d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=c154cff2b3254c7a685b48c4506a3260fb18e7fab8a3546fd2194824cc1deb08&X-Amz-SignedHeaders=host&x-id=GetObject)


After creating the key pair, you can select it now.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/f0770b20-a220-4560-8b7a-5ac33d96de85/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=9fde62dfe1f419a80c332b34ed09ec5e09e3795bd1af9bb0bd113685e477dc0b&X-Amz-SignedHeaders=host&x-id=GetObject)


For network settings, we will edit them as follows:


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c595234b-dbdc-4f83-b684-4c350daca38e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=22b98c940b009f96019d1d26827587c157b1ea8b9b1f762497737496833de23f&X-Amz-SignedHeaders=host&x-id=GetObject)


We can click "Launch Instance" now, leaving the other settings at their defaults is fine.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/79b9cff1-0e52-4a72-87af-dae0b5516d0d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=4f51fb9b3c644451106ae23cddf7fbb1df78daf1be1bd983cfa6b9b65dedf2bf&X-Amz-SignedHeaders=host&x-id=GetObject)


Now, we’re done setting up the VPC AWS resources!


# IV. Setup VPC DC resources


Move on to this step, this will create resources to act as a regular on-premises data center. Like the previous step, I won’t set up anything related to the site-to-site connection yet.


## 1. VPC - DC


Fill out the form and click "Create."


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/0d6aadf7-3b64-4164-9e03-6a82b8f04360/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=bebfd4b6e12b86bd91905d31932d30ac3042ce0cadd29bc4a24d0bbb89fa6e46&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Subnet - DC - Public subnet


Do the same as above: fill out the form and click "Create".


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/ec7238df-60d0-40b0-9d18-4168eb7c0421/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=4d6a51a90c0da3ea1899087f06286d81123f5372b385401c19c8a49a92fc6f11&X-Amz-SignedHeaders=host&x-id=GetObject)


## 3. Route Table - DC - Public


Do the same as above: fill out the form and click "Create".


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/51553b32-bb31-495a-8752-0d9b66fa1c49/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=d508f2143a68f88897b07119dc08133f606b92566c3b32efee0d20c0536db207&X-Amz-SignedHeaders=host&x-id=GetObject)


Associate this route with the **DC - Public subnet**.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/82961b2d-68e2-4632-908b-0b84c43007e8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=83c6ca19eae4dc71d0cac27937056c3902b5db43c9a71fe57aa3ae2d13d1364e&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/de863335-49b5-4fd0-86b3-a2b0a61a5efd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=6ca3ea5a99431f78c0502885ff2e0b509ab07ea0c0344ebbed33e42bded3b818&X-Amz-SignedHeaders=host&x-id=GetObject)


## 4. Security Group - DC - Public


Fill out the form and click "Create." This will **allow** any client (computer, laptop, server, etc.) to **ping all EC2 instances** in the **Subnet - DC - Public** subnet if they can "see" each other.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/90ef2fd8-8309-4cdf-8a70-aff67ad95069/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=7b1603056c1721a1716d7fa070d180b5990352961030a5d5402a6831dc54a4b7&X-Amz-SignedHeaders=host&x-id=GetObject)


## 5. Internet Gateway - DC - IGW


Create an Internet Gateway - DC - IGW to allow the DC - VPC to connect to the internet.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/2dc2ede2-912f-4c54-983f-33230a1e25f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=b75231a14dc2e3243b6b29d961e5f9e0bb1c6f57778bb404c0c23ce4d9c8214f&X-Amz-SignedHeaders=host&x-id=GetObject)


Attach it to **VPC - DC**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/bc9962b3-3b6b-4146-95ec-fa20b3e0417e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=1b5425972c9628616ef2ae4f725d1f47a594303f76402d053f2aa194e8716197&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9d52f744-bcd0-419e-aef7-9cf1383ae06d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=69720f814340ad7f1f8743928beedf8597b1153f8ceda8bc1053c07cee9d1f4d&X-Amz-SignedHeaders=host&x-id=GetObject)


Go back to the Route Table and edit it to accept the attached Internet Gateway.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/df0364d1-faff-4346-a66f-bd7c3f361296/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150401Z&X-Amz-Expires=3600&X-Amz-Signature=fb840d24ce9dde087b890f779e9d9dd52783b556a4baccbbc6d2934480dd6af8&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/8d516c8e-c307-4d41-8060-10080477035f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=6b4555fc9857091c1487295bcc58caf9486c29530042ea3a5047fcb7ef6f071a&X-Amz-SignedHeaders=host&x-id=GetObject)


The route should look like this


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/950790c5-069b-4222-9591-a8819bd38aa7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=2eb273c593f7da1387e644a4911a78dd1b53a3dd87e9f061700692438a607e17&X-Amz-SignedHeaders=host&x-id=GetObject)


## 6. EC2 - DC - EC2 Openswan Gateway


### 6.1 Create DC - EC2 Openswan Gateway


This form is quite long, so we will fill it out step by step.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/68379cf6-81c1-4bdd-b50c-97f882a75c39/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=ce687354d4a77ffb3426db5fc0958f27c314d71ac4d0cee235bcdf60759b590c&X-Amz-SignedHeaders=host&x-id=GetObject)


Create a key pair to be able to SSH into AWS - EC2 - Private if you don’t already have one.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3e8f3b13-abe4-476a-9702-c922dd617d30/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=7e3ec4de1fc5b670048f6be266cac084b682ab347f1204605a56b52539bc1c6e&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/2de80525-c893-42fc-babd-52d67f9add5b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=b2ae3188564a6640c42739f24bd46cc49f32dbb0f51b23d2cbfe4e4d5ebe9ebf&X-Amz-SignedHeaders=host&x-id=GetObject)


Select the newly created key pair.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/19e053e9-2c19-4295-9a2f-b7329afb1be8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=3c9cfe72975eaed8acd1cddbaecb9d8d1bf879eda251b139fe26de26b809b204&X-Amz-SignedHeaders=host&x-id=GetObject)


Edit Network like this


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3b2c7b64-dabe-43be-9af1-318c8bab86cc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=278d426da1399b20a7160c143ff64914a2279ba86eb50989e79e60a471d79a58&X-Amz-SignedHeaders=host&x-id=GetObject)


We can click "Launch Instance" now, leaving the other settings at their defaults is fine.


### 6.2 Verify SSH-able from MyIP


Let’s go to the Instance Details, you can see that DC - EC2 Openswan Gateway is already up with a Public IPv4 address.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/79c40755-2a43-4aa6-a1c5-d8aefe0fd69c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=38f398ab617f5841f72105cf3893045ec9fe9671b8725d3a011683d6adf1ff94&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/330d9412-b5e2-41c2-86ba-66c9f4fa82d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=f83d79bc36b7a944995d13e1fd4db7051ff4e965f6cb0414d6c829b7b92bc2fd&X-Amz-SignedHeaders=host&x-id=GetObject)


Refresh the page if it says "Success" but shows nothing.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/d3b02044-81aa-4990-af24-c7140f784c21/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=3d3772cf2a02085517a96c9728342f670ff3e80b231b5b1332afb698d89b35e4&X-Amz-SignedHeaders=host&x-id=GetObject)


Select and attach it to **VPC - AWS**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c4bb2bf1-9956-42f9-8d1a-6319b893192e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=a38e4108d1c89a622d93ac365c2564fcd19b7ff39ab52ea941f9b171ee20b4bd&X-Amz-SignedHeaders=host&x-id=GetObject)


Edit the Route Table - **AWS - Private** so it can route traffic from this VGW.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/3e4acad0-4c0e-4f11-86b1-bd63fb30145d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=f189871dd6c38718045e162d4d0e7a465c6c4055555590912b9f7f5f55d8b8fc&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/424b778e-2ce9-487e-99e5-b179a35f49d6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=a2235138ec5fd68db5364975cab0ce858eb2b70e95f557c7a02fb31ff7c4625e&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/5c412718-7ea4-47b9-b63b-6b0c0f33ebc7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=873bfddb3be34666b69720824106be5267f9c8b067226df0abfd572fbdfc8a27&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Customer Gateway - DC - CGW


Create a Customer Gateway, this will be used for the Site-to-Site connection to identify which customer gateway it will connect to.


The **IP address** is your **DC - EC2 - Openswan Gateway IPv4 Public Address** (the same one we used for the SSH check).


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/fb430193-1289-4cd2-86d0-857538ce770e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=2a736e0ae28327b5ae238f26349fe35000f479cd676b044cffcd5d4c283597c1&X-Amz-SignedHeaders=host&x-id=GetObject)


# V. Site-to-Site VPN - AWS to DC


## 1. Setup Site-to-Site VPN - AWS to DC


Fill out the form as follows, with explanations:

1. **Static IP Prefixes:** You will need to fill in two CIDRs. The first is our **VPC - DC (192.168.0.0/16)**, and the second is **VPC - AWS (10.10.0.0/16)**.
2. **Local IPv4 Network CIDR:** Fill in our **VPC - DC** CIDR **(192.168.0.0/16)**.
3. **Remote IPv4 Network CIDR:** Fill in our **VPC - AWS** CIDR **(10.10.0.0/16)**.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/9d504ed3-e661-48c3-bdad-49e63cd32849/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=133d01faa3b5deada3326c24b7e182eec085a2f37fb875940c929d3bd481d908&X-Amz-SignedHeaders=host&x-id=GetObject)


That’s everything, click "Create" You should see the new VPN connection from **AWS to DC**. We will move on to the next step while waiting for this VPN to be ready.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a1e2e5d9-c7f5-4910-9e33-66561c005baf/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=093e1ff0ce12365624ce6969190634abc75e7d21b02f549f318204d1e66ac5cd&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Setup Openswan on EC2 - DC - EC2 Openswan Gateway


Click "Download Configuration" We will use this configuration to set up our Openswan gateway.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/6f70348e-d33e-45dd-8a40-a1f9bb8e07e5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=f992ae8fdbdf84eb4263efd1b7c8d23d6896d3c594c2dca5d8237b7ae62f5045&X-Amz-SignedHeaders=host&x-id=GetObject)


Select the options as shown, and click "Download"


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a86bca94-8776-41fb-b791-37ad1ceeea70/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=d93f26a55ffed281eee1c4ed64ee8e7d26582b9b31c055102bd914191bb62a6c&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/bc63c416-3600-4e66-8053-75229d7f0d4b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=d6ac8fb108f13e5895f86df6ac4faccbfda3dc29a179165dab2bbc883e0e57f6&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/7368c218-edee-4463-86ec-37f1251732cb/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=806e65f4d91c8048a08f9f2378e7a49bcf7517a292b672cc7957beafb974ec0d&X-Amz-SignedHeaders=host&x-id=GetObject)


In this workshop, I’ll only use one tunnel, because with my current Static IP VPN connection strategy, it would cause **random asymmetric routing** if I use 2 tunnels in my VPN. You can still use 2 tunnels and avoid this issue by using a Dynamic IP (try it if you’re a curious cat).


## 3. Test SSH from DC - EC2 Openswan Gateway to AWS - EC2 Private


First, we edit the Security Group - **AWS - Private** to allow SSH from **DC - EC2 Openswan Gateway**.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/255fe5cf-8ee6-4d87-8eb9-5e7bef5c3843/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150402Z&X-Amz-Expires=3600&X-Amz-Signature=cd1f2b948b2e5764228bd42b136a65714959c88712986ff1b40c9992623422ac&X-Amz-SignedHeaders=host&x-id=GetObject)


Fill in the IPv4 Private address of **DC - EC2 Openswan Gateway** with a subnet mask of /32.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/59471b7d-398e-4600-b61a-6f1de86abd3a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=b7de585468a87c61966e7d01425ea84d7b9320d0996b6878acf99b7d82aedfb3&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/c9c35b04-9b5e-4767-bee5-b8457fe57dee/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=6c5810292b2dd95e6239b82b642836993a83fdfbae0b5f4020b96fa2ab3a9246&X-Amz-SignedHeaders=host&x-id=GetObject)


Now we’re allowed to SSH into **AWS - Private** if the connecting IP matches.


If you’re wondering why it’s an **IPv4 Private** address, it’s because the VPN connection is already set up. The two servers now think they’re on the same network, they no longer consider themselves connected through the internet, so they use IPv4 Private addresses to connect.


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/09747000-41dd-49e7-ad83-b1ab40f340c7/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=8c110923c1350f817ed5eefb1a16f0e42c2ab55c911cfb24605378d7cad15e4c&X-Amz-SignedHeaders=host&x-id=GetObject)


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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/40a8a6d1-b96a-4478-94f9-eb873193f17d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=549013e5285edb220581c38b6761b0568435bfe9a7aa5ece35adcec652fd05af&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Goodbye VPCs


Delete VPCs with subnet too, nice


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/618c1bc8-bfca-4ac3-b618-580693b743da/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=eb787d12808b5bf8246dae3acc6283d9c3fa1cf81f5d7a2bee8c82e048eefbb2&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/60597ad3-2ee6-4d68-8341-5902d90e8410/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=ea96b1af87df9d1f6ee6dc7c48f549d1406a3cb0f48e8542c44252ce5ddbaeb2&X-Amz-SignedHeaders=host&x-id=GetObject)


Delete AWS with it’s Subnet too


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/a817720f-db1b-4240-a287-28d3b163e440/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=630ca5b5289ebd0c6d63e7442c724410033aa7d0f5578c661d7a50df11b8b900&X-Amz-SignedHeaders=host&x-id=GetObject)


## 2. Goodbye Subnets


Should be auto deleted when VPC deleted


## 3. Goodbye Route Tables


Should be auto deleted when VPC deleted


## 4. Goodbye Security Groups


Should be auto deleted when VPC deleted


## 5. Goodbye Internet Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/dc4fef95-50e6-4092-94a4-ec4323ad522c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=2ee8b0f7bd56e17051dfe5af6be5607284f5727dfb183e0ed6554d09845aacf1&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/e837f1d0-b72f-4b3d-96b6-a8742780d449/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=358b15688f842385b7e2f9f9a04b9962e6edf634b32e94edcfd438ab5bdf89bd&X-Amz-SignedHeaders=host&x-id=GetObject)


## 6. Goodbye Setup Site-to-Site VPNs


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/43701e60-6c41-4c79-a14b-1a5fc04e3208/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=5c8d69b4c336ee7774f10f654279adf77d8c32e570f0b1613d9fd9cf6cb2d288&X-Amz-SignedHeaders=host&x-id=GetObject)


## 7. Goodbye Virtual Private Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/28c08793-79ca-49be-84be-b1eb187d404c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=ce31c4132a037d8f703bcfb7aa14ee6805c1f955b9220d813604d49df74ddd20&X-Amz-SignedHeaders=host&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/32186cb5-6071-4c7b-9e1c-33f89f69207a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=1c94239c41aeee839e65f408d1746decb3838faef4cf2b4e7c231f81c574926c&X-Amz-SignedHeaders=host&x-id=GetObject)


## 8. Goodbye Customer Gateways


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d5da4832-3825-4b06-9f7d-86c687d890a2/fe6ae0bb-7412-4111-8fdb-b061543f5331/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240830T150404Z&X-Amz-Expires=3600&X-Amz-Signature=ee71cb1173355922314bf77d3b8408654e1614c84e873135a7cd47dfa761f9ca&X-Amz-SignedHeaders=host&x-id=GetObject)


We’re now as clean as a whistle. 

