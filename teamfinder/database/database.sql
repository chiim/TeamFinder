USE `database`;

CREATE TABLE `Accounts` (
    `AccountId` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Age` VARCHAR(3) NOT NULL,
    `PhoneNr` VARCHAR(15) NOT NULL,
    `City` VARCHAR(30) NOT NULL,
    `Gender` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`AccountId`)
);

CREATE TABLE `Groups` (
    `GroupId` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(30) NOT NULL,
    `sport` VARCHAR(20) NOT NULL,
    `NrOfMembers` INT NOT NULL,
    `MemberSlots` INT NOT NULL,
    `City` VARCHAR(30) NOT NULL,
    `minAge` INT,
    `MaxAge` INT,
    `skillLevel` VARCHAR(15),
    `AllowedGender` VARCHAR(5),
    `PublishingDate` DATE NOT NULL,
    `AuthorId` INT NOT NULL,
    PRIMARY KEY (`GroupId`),
    UNIQUE(Name)
);

-- ``: Endast för reserverade ord
-- '': Används när man ska skriva in values
-- Inga citat tecken om det inte är ett reserverat ord av SQL.

CREATE TABLE `Messages` (
    `MessageId` INT NOT NULL AUTO_INCREMENT,
    `GroupId` INT NOT NULL,
    `AccountId` INT NOT NULL,
    `Text` VARCHAR(500) NOT NULL,
    `PublishingDate` VARCHAR(10) NOT NULL,
    `AuthorName` VARCHAR(50) NOT NULL,
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

INSERT INTO `Accounts` (`Name`, `Email`, `Age`, `PhoneNr`, `City`, `Gender`) VALUES ('nylagd', 'abc', '20', '12345', 'Jkpg', 'male');