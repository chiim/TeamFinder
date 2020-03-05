USE `database`;
SET `time_zone` = '+02:00';

CREATE TABLE `Accounts` (
    `accountId` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(80) NOT NULL,
    `age` VARCHAR(3) NOT NULL,
    `city` VARCHAR(30) NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`accountId`),
    UNIQUE(email)
);

CREATE TABLE `Groups` (
    `groupId` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `image` VARCHAR(30),
    `sport` VARCHAR(20) NOT NULL,
    `nrOfMembers` INT NOT NULL,
    `memberSlots` VARCHAR(2) NOT NULL,
    `city` VARCHAR(30) NOT NULL,
    `minAge` VARCHAR(3),
    `maxAge` VARCHAR(3),
    `skillLevel` VARCHAR(15) NOT NULL,
    `allowedGender` VARCHAR(10),
    `authorId` INT NOT NULL,    
    `publishingDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,    
    PRIMARY KEY (`groupId`),
    FOREIGN KEY (`authorId`) REFERENCES Accounts(`accountId`) ON DELETE CASCADE,
    UNIQUE(name)
);

-- ``: Endast för reserverade ord
-- '': Används när man ska skriva in values
-- Inga citat tecken om det inte är ett reserverat ord av SQL.

CREATE TABLE `Messages` (
    `messageId` INT NOT NULL AUTO_INCREMENT,
    `groupId` INT NOT NULL,
    `accountId` INT NOT NULL,
    `text` VARCHAR(500) NOT NULL,
    `authorName` VARCHAR(50) NOT NULL,
    `publishingDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`messageId`),
    FOREIGN KEY (`accountId`) REFERENCES Accounts(`accountId`) ON DELETE CASCADE,
    FOREIGN KEY (`groupId`) REFERENCES Groups(`groupId`) ON DELETE CASCADE
);

CREATE TABLE `GroupMembers` (
    `accountId` INT NOT NULL,
    `groupId` INT NOT NULL,
    FOREIGN KEY (`accountId`) REFERENCES Accounts(`accountId`) ON DELETE CASCADE,
    FOREIGN KEY (`groupId`) REFERENCES Groups(`groupId`) ON DELETE CASCADE
);

INSERT INTO `Accounts` (`firstName`, `lastName`, `email`, `password`, `age`, `city`, `gender`) VALUES ('admin', 'admin', 'a@a', '$2b$10$d/Rmn96Ktxx0YJ2dQ2X/iOJDzFGv/EU90VwB/f6U4iZ1QmIYqyOFa', '28', 'Jkpg', 'male');
INSERT INTO `Accounts` (`firstName`, `lastName`, `email`, `password`, `age`, `city`, `gender`) VALUES ('Knugen', 'Axelsson', 'b@b', '$2b$10$4CgUwazdNHL0bZBmhaRUGunNf27fMZby7O3I6BioBhfyhk3SgClzO', '28', 'Jkpg', 'male');
INSERT INTO `Accounts` (`firstName`, `lastName`, `email`, `password`, `age`, `city`, `gender`) VALUES ('Bulten', 'Axelsson', 'w@w', '$2b$10$qAxwACTHOEK.zZAli6SBvuyfmy4FcBO6NMUBKqz6/hdGNo3jhb4Qe', '5', 'Jkpg', 'male');

INSERT INTO `Groups` (`name`, `image`, `sport`, `nrOfMembers`, `memberSlots`, `city`, `minAge`, `maxAge`, `skillLevel`, `allowedGender`, `authorId`) VALUES ('grupp1', 'Volleyball', 'Volleyball', '0', '10', 'Jkpg', '2', '100', 'Beginner', 'Any', '1');
INSERT INTO `Groups` (`name`, `image`, `sport`, `nrOfMembers`, `memberSlots`, `city`, `minAge`, `maxAge`, `skillLevel`, `allowedGender`, `authorId`) VALUES ('grupp2', 'Volleyball', 'Volleyball', '0', '10', 'Jkpg', '2', '100', 'Beginner', 'Any', '1');
INSERT INTO `Groups` (`name`, `image`, `sport`, `nrOfMembers`, `memberSlots`, `city`, `minAge`, `maxAge`, `skillLevel`, `allowedGender`, `authorId`) VALUES ('grupp3', 'Volleyball', 'Volleyball', '0', '10', 'Jkpg', '2', '100', 'Beginner', 'Any', '1');

INSERT INTO `Messages` (`groupId`, `accountId`, `text`, `authorName`) VALUES ('1', '1', 'first message wohooo', 'Knugen');
INSERT INTO `Messages` (`groupId`, `accountId`, `text`, `authorName`) VALUES ('1', '2', 'woof woof', 'Bulten');
INSERT INTO `Messages` (`groupId`, `accountId`, `text`, `authorName`) VALUES ('1', '1', 'wtf gör du här Bulten?', 'Knugen');
INSERT INTO `Messages` (`groupId`, `accountId`, `text`, `authorName`) VALUES ('2', '2', 'woofwoof', 'Bulten');

INSERT INTO `GroupMembers` (`accountId`, `groupId`) VALUES ('1', '1');
INSERT INTO `GroupMembers` (`accountId`, `groupId`) VALUES ('1', '3');
INSERT INTO `GroupMembers` (`accountId`, `groupId`) VALUES ('2', '2');