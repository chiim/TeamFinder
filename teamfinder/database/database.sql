USE `database`;
SET `time_zone` = '+02:00';

CREATE TABLE `Accounts` (
    `AccountId` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL,
    `LastName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(30) NOT NULL,
    `Age` VARCHAR(3) NOT NULL,
    `City` VARCHAR(30) NOT NULL,
    `Gender` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`AccountId`)
);

CREATE TABLE `Groups` (
    `GroupId` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(30) NOT NULL,
    `Image` VARCHAR(30),
    `Sport` VARCHAR(20) NOT NULL,
    `NrOfMembers` INT NOT NULL,
    `MemberSlots` VARCHAR(2) NOT NULL,
    `City` VARCHAR(30) NOT NULL,
    `MinAge` VARCHAR(3),
    `MaxAge` VARCHAR(3),
    `SkillLevel` VARCHAR(15) NOT NULL,
    `AllowedGender` VARCHAR(10),
    `AuthorId` INT NOT NULL,
    `PublishingDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,    
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
    `AuthorName` VARCHAR(50) NOT NULL,
    `PublishingDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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


INSERT INTO `Accounts` (`FirstName`, `LastName`, `Email`, `Password`, `Age`, `City`, `Gender`) VALUES ('Knugen', 'Axelsson', 'email', '123', '28', 'Jkpg', 'male');
INSERT INTO `Accounts` (`FirstName`, `LastName`, `Email`, `Password`, `Age`, `City`, `Gender`) VALUES ('Bulten', 'Axelsson', 'woof@woof', '10/10', '5', 'Jkpg', 'male');

INSERT INTO `Groups` (`Name`, `Image`, `Sport`, `NrOfMembers`, `MemberSlots`, `City`, `MinAge`, `MaxAge`, `SkillLevel`, `AllowedGender`, `AuthorId`) VALUES ('grupp1', 'Volleyball', 'Volleyball', '1', '4', 'Jkpg', '20', '30', 'Beginner', 'Any', '1');
INSERT INTO `Groups` (`Name`, `Image`, `Sport`, `NrOfMembers`, `MemberSlots`, `City`, `MinAge`, `MaxAge`, `SkillLevel`, `AllowedGender`, `AuthorId`) VALUES ('grupp2', 'Volleyball', 'Volleyball', '1', '4', 'Jkpg', '20', '30', 'Beginner', 'Any', '1');
INSERT INTO `Groups` (`Name`, `Image`, `Sport`, `NrOfMembers`, `MemberSlots`, `City`, `MinAge`, `MaxAge`, `SkillLevel`, `AllowedGender`, `AuthorId`) VALUES ('grupp3', 'Volleyball', 'Volleyball', '1', '4', 'Jkpg', '20', '30', 'Beginner', 'Any', '1');

INSERT INTO `Messages` (`GroupId`, `AccountId`, `Text`, `AuthorName`) VALUES ('1', '1', 'first message wohooo', 'Knugen');
INSERT INTO `Messages` (`GroupId`, `AccountId`, `Text`, `AuthorName`) VALUES ('1', '2', 'woof woof', 'Bulten');
INSERT INTO `Messages` (`GroupId`, `AccountId`, `Text`, `AuthorName`) VALUES ('1', '1', 'wtf gör du här Bulten?', 'Knugen');
INSERT INTO `Messages` (`GroupId`, `AccountId`, `Text`, `AuthorName`) VALUES ('2', '2', 'woofwoof', 'Bulten');



