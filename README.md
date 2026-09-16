# DotActiv Dashboard

A responsive store dashboard built with an **ASP.NET Core Web API** backend and an **AngularJS** frontend.

---

## Features

- Role-based Authorization
- Real-time Search & Filtering
- Interactive Sorting
- DotActiv Branded UI

---

## Tech Stack

- **Backend:** ASP.NET Core 8.00, Entity Framework Core, Microsoft SQL Server
- **Frontend:** AngularJS, Bootstrap
- **Data Access:** LINQ, SQL Server Management Studio

---

## Database Setup

1. Open **SQL Server Management Studio (SSMS)** and connect to your local SQL Server
2. Open the setup script located at: **Sql/DotActivDB_Setup.sql**
3. Go to Line 54 and change the file location to work with your setup
4. Run the file to setup the DB

---

## Configure and Run the Application

1. Open **appsettings.json** and change the connection string to your local SQL Server Instance
2. Open the **DotActivDashboard.sln*** in Visual Studio
3. Press F5 to build and run the application
4. Navigate to your browser with this URL : **https://localhost:7056/**

---

## Test Accounts

Username - **National_Manager**	| Password - **SeeAllStores**
Username - **WC_Manager**		| Password - **CapeTown123**
Username - **GP_Manager**		| Password - **Joburg456**