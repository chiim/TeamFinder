USE `database`;

CREATE TABLE `Accounts` (
    `AccountId` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50),
    `Email` VARCHAR(50),
    `Age` VARCHAR(3),
    `PhoneNr` VARCHAR(15),
    `City` VARCHAR(30),
    `Gender` VARCHAR(10),
    PRIMARY KEY (`AccountId`)
);
CREATE TABLE `Groups` (
    `GroupId` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(30),
    `NrOfMembers` INT,
    `MaxNrOfMembers` INT,
    `City` VARCHAR(30),
    `MaxAge` INT,
    `MinAge` INT,
    `AllowedGender` VARCHAR(5),
    `PublishingDate` VARCHAR(10),
    `AuthorId` INT,
    PRIMARY KEY (`GroupId`)
);

CREATE TABLE `Messages` (
    `MessageId` INT NOT NULL AUTO_INCREMENT,
    `GroupId` INT NOT NULL,
    `AccountId` INT NOT NULL,
    `Text` VARCHAR(500),
    `PublishingDate` VARCHAR(10),
    `AuthorName` VARCHAR(50),
    PRIMARY KEY (`MessageId`),
    FOREIGN KEY (`AccountId`) REFERENCES Accounts(`AccountId`),
    FOREIGN KEY (`GroupId`) REFERENCES Groups(`GroupId`)
);

CREATE TABLE `GroupMembers` (
    `AccountId` INT NOT NULL,
    `GroupId` INT NOT NULL,
    FOREIGN KEY (`AccountId`) REFERENCES Accounts(`AccountId`),
    FOREIGN KEY (`GroupId`) REFERENCES Groups(`GroupId`)
);

-- INSERT INTO `Accounts` VALUES (`test`, `abc`, `20`, `12345`, `Jkpg`, `male`)

