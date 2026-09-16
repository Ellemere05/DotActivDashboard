IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DotActivDB')
BEGIN
    CREATE DATABASE DotActivDB;
END
GO

USE DotActivDB;
GO

DROP TABLE IF EXISTS tStores;
DROP TABLE IF EXISTS tUsers;
DROP TABLE IF EXISTS tRoles;
GO

CREATE TABLE tRoles (
    pkRoleId INT IDENTITY(1,1) PRIMARY KEY,
    sRoleName VARCHAR(100) NOT NULL,
    sProvince VARCHAR(100) NULL
);

CREATE TABLE tUsers (
    pkUserId INT IDENTITY(1,1) PRIMARY KEY,
    sUsername VARCHAR(100) NOT NULL UNIQUE,
    sPassword VARCHAR(100) NOT NULL,
    fkRoleId INT NOT NULL,
    CONSTRAINT FK_tUsers_tRoles FOREIGN KEY (fkRoleId) REFERENCES tRoles(pkRoleId)
);

CREATE TABLE tStores (
    pkStoreId INT IDENTITY(1,1) PRIMARY KEY,
    sStoreCode VARCHAR(20) NOT NULL UNIQUE,
    sStoreName VARCHAR(150) NOT NULL,
    sDivision VARCHAR(50) NOT NULL,
    sProvince VARCHAR(50) NOT NULL,
    iOverduePlanograms INT NOT NULL DEFAULT 0
);
GO

INSERT INTO tRoles (sRoleName, sProvince) VALUES 
('National Manager', NULL),
('Western Cape Manager', 'Western Cape'),
('Gauteng Manager', 'Gauteng');

INSERT INTO tUsers (sUsername, sPassword, fkRoleId) VALUES
('National_Manager', 'SeeAllStores', 1),
('WesternCape_Manager', 'CapeTownSunshine', 2),
('Gauteng_Manager', 'JoburgGoldReef', 3);
GO

DECLARE @JsonContent VARCHAR(MAX);

SELECT @JsonContent = BulkColumn
FROM OPENROWSET(
    BULK 'C:\Users\...\...\C# Software Development Assignment\DotActivDashboard\sql\stores.json', 
    SINGLE_CLOB
) AS JsonData;

INSERT INTO tStores (sStoreCode, sStoreName, sDivision, sProvince, iOverduePlanograms)
SELECT 
    storeCode,
    storeName,
    division,
    province,
    overduePlanograms
FROM OPENJSON(@JsonContent)
WITH (
    storeCode VARCHAR(20) '$.storeCode',
    storeName VARCHAR(150) '$.storeName',
    division VARCHAR(50) '$.division',
    province VARCHAR(50) '$.province',
    overduePlanograms INT '$.overduePlanograms'
);
GO

-- Added just to confirm row counts
SELECT 'Roles Count' AS TableName, COUNT(*) AS TotalRows FROM tRoles
UNION ALL
SELECT 'Users Count', COUNT(*) FROM tUsers
UNION ALL
SELECT 'Stores Count', COUNT(*) FROM tStores;
GO