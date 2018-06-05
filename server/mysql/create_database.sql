-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema tjillepret
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tjillepret
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tjillepret` DEFAULT CHARACTER SET utf8 ;
USE `tjillepret` ;

-- -----------------------------------------------------
-- Table `tjillepret`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`categories` (
  `category_id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `header` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`color_classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`color_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(600) NOT NULL,
  `max_saturation` FLOAT NULL DEFAULT NULL,
  `max_hue` INT(11) NULL DEFAULT NULL,
  `max_lightness` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  `joined_on` INT(11) NOT NULL,
  `email` VARCHAR(250) NULL DEFAULT NULL,
  `bio` VARCHAR(255) NULL DEFAULT NULL,
  `is_admin` TINYINT(4) NULL DEFAULT NULL,
  `last_activity` INT(11) NULL DEFAULT NULL,
  `online` TINYINT(4) NULL DEFAULT NULL,
  `checked_notifications_time` INT(11) NULL DEFAULT NULL,
  `apple_user` TINYINT(4) NULL DEFAULT NULL,
  `r` INT(11) NOT NULL,
  `g` INT(11) NOT NULL,
  `b` INT(11) NOT NULL,
  `profile_pic` VARCHAR(45) NULL DEFAULT NULL,
  `header` VARCHAR(45) NULL DEFAULT NULL,
  `wallpaper` VARCHAR(45) NULL DEFAULT NULL,
  `color_class_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `fk_users_color_classes1` (`color_class_id` ASC),
  CONSTRAINT `fk_users_color_classes1`
    FOREIGN KEY (`color_class_id`)
    REFERENCES `tjillepret`.`color_classes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 279
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`chats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`chats` (
  `chat_id` INT(11) NOT NULL AUTO_INCREMENT,
  `started_by` INT(11) NOT NULL,
  `started_on` INT(11) NOT NULL,
  `is_group` TINYINT(4) NOT NULL,
  `group_title` VARCHAR(64) NULL DEFAULT NULL,
  `group_pic` VARCHAR(45) NULL DEFAULT NULL,
  `group_description` VARCHAR(512) NULL DEFAULT NULL,
  `old_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`chat_id`, `started_by`),
  INDEX `fk_chat_users1_idx` (`started_by` ASC),
  CONSTRAINT `fk_chat_users1`
    FOREIGN KEY (`started_by`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 306
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`chat_members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`chat_members` (
  `chat_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `joined_chat_on` INT(11) NOT NULL,
  `is_chat_admin` TINYINT(4) NULL DEFAULT NULL,
  `muted` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`chat_id`, `user_id`),
  INDEX `fk_chat_member_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_chat_member_chat1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `tjillepret`.`chats` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_member_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`posts` (
  `post_id` INT(11) NOT NULL AUTO_INCREMENT,
  `uploaded_by` INT(11) NOT NULL,
  `category_id` INT(11) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(2048) NOT NULL,
  `uploaded_on` INT(11) NOT NULL,
  `type` ENUM('img', 'vid', 'gif') NOT NULL,
  `path` VARCHAR(45) NOT NULL,
  `views` INT(11) NOT NULL DEFAULT '0',
  `duration` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`, `uploaded_by`, `category_id`),
  INDEX `fk_uploads_users1_idx` (`uploaded_by` ASC),
  INDEX `fk_uploads_categories1_idx` (`category_id` ASC),
  CONSTRAINT `fk_uploads_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `tjillepret`.`categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_uploads_users1`
    FOREIGN KEY (`uploaded_by`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 120
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`comments` (
  `comment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `time` INT(11) NOT NULL,
  `text` VARCHAR(512) NULL DEFAULT NULL,
  `giphy` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`, `post_id`, `user_id`),
  INDEX `fk_comments_users1_idx` (`user_id` ASC),
  INDEX `fk_comments_uploads1` (`post_id` ASC),
  CONSTRAINT `fk_comments_uploads1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tjillepret`.`posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comments_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 579
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`comment_votes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`comment_votes` (
  `comment_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `up` TINYINT(4) NOT NULL,
  `time` INT(11) NOT NULL,
  PRIMARY KEY (`comment_id`, `user_id`),
  INDEX `fk_comment_votes_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_comment_votes_comments1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `tjillepret`.`comments` (`comment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_votes_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`friend_invites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`friend_invites` (
  `inviter_id` INT(11) NOT NULL,
  `invited_id` INT(11) NOT NULL,
  `time` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inviter_id`, `invited_id`),
  INDEX `fk_friend_invites_users2_idx` (`invited_id` ASC),
  CONSTRAINT `fk_friend_invites_users1`
    FOREIGN KEY (`inviter_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_friend_invites_users2`
    FOREIGN KEY (`invited_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`friendships`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`friendships` (
  `accepter_id` INT(11) NOT NULL,
  `inviter_id` INT(11) NOT NULL,
  `since` INT(11) NOT NULL,
  PRIMARY KEY (`accepter_id`, `inviter_id`),
  INDEX `fk_friendship_users2_idx` (`inviter_id` ASC),
  CONSTRAINT `fk_friendship_users1`
    FOREIGN KEY (`accepter_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_friendship_users2`
    FOREIGN KEY (`inviter_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`message_media`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`message_media` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` ENUM('giphy', 'upload') NOT NULL DEFAULT 'upload',
  `path` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9977998
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `chat_id` INT(11) NOT NULL,
  `sent_by` INT(11) NOT NULL,
  `sent_on` INT(11) NOT NULL,
  `text` VARCHAR(512) NOT NULL,
  `message_media_id` INT(11) NULL DEFAULT NULL,
  `old_time` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `chat_id`, `sent_by`),
  INDEX `fk_message_chat1_idx` (`chat_id` ASC),
  INDEX `fk_message_users1_idx` (`sent_by` ASC),
  INDEX `fk_message_message_media1_idx` (`message_media_id` ASC),
  CONSTRAINT `fk_message_chat1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `tjillepret`.`chats` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_message_media1`
    FOREIGN KEY (`message_media_id`)
    REFERENCES `tjillepret`.`message_media` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_users1`
    FOREIGN KEY (`sent_by`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 11010
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`message_readers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`message_readers` (
  `message_id` INT(11) NOT NULL,
  `read_by` INT(11) NOT NULL,
  `read_on` INT(11) NOT NULL,
  PRIMARY KEY (`message_id`, `read_by`),
  INDEX `fk_message_reader_users1_idx` (`read_by` ASC),
  CONSTRAINT `fk_message_reader_message1`
    FOREIGN KEY (`message_id`)
    REFERENCES `tjillepret`.`messages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_reader_users1`
    FOREIGN KEY (`read_by`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`post_votes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`post_votes` (
  `post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `up` TINYINT(4) NOT NULL,
  `time` INT(11) NOT NULL,
  PRIMARY KEY (`post_id`, `user_id`),
  INDEX `fk_post_votes_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_post_votes_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tjillepret`.`posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_post_votes_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjillepret`.`tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`tokens` (
  `token` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `created` INT(11) NOT NULL,
  `expires` INT(11) NOT NULL,
  PRIMARY KEY (`token`, `user_id`),
  INDEX `fk_tokens_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_tokens_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjillepret`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

USE `tjillepret` ;

-- -----------------------------------------------------
-- Placeholder table for view `tjillepret`.`user_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjillepret`.`user_info` (`user_id` INT, `username` INT, `password` INT, `joined_on` INT, `email` INT, `bio` INT, `is_admin` INT, `last_activity` INT, `online` INT, `checked_notifications_time` INT, `apple_user` INT, `r` INT, `g` INT, `b` INT, `profile_pic` INT, `header` INT, `wallpaper` INT, `color_class_id` INT, `friends` INT, `uploads` INT, `groups` INT, `messages` INT, `rep` INT, `views` INT, `comments` INT);

-- -----------------------------------------------------
-- View `tjillepret`.`user_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tjillepret`.`user_info`;
USE `tjillepret`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `tjillepret`.`user_info` AS select `tjillepret`.`users`.`user_id` AS `user_id`,`tjillepret`.`users`.`username` AS `username`,`tjillepret`.`users`.`password` AS `password`,`tjillepret`.`users`.`joined_on` AS `joined_on`,`tjillepret`.`users`.`email` AS `email`,`tjillepret`.`users`.`bio` AS `bio`,`tjillepret`.`users`.`is_admin` AS `is_admin`,`tjillepret`.`users`.`last_activity` AS `last_activity`,`tjillepret`.`users`.`online` AS `online`,`tjillepret`.`users`.`checked_notifications_time` AS `checked_notifications_time`,`tjillepret`.`users`.`apple_user` AS `apple_user`,`tjillepret`.`users`.`r` AS `r`,`tjillepret`.`users`.`g` AS `g`,`tjillepret`.`users`.`b` AS `b`,`tjillepret`.`users`.`profile_pic` AS `profile_pic`,`tjillepret`.`users`.`header` AS `header`,`tjillepret`.`users`.`wallpaper` AS `wallpaper`,`tjillepret`.`users`.`color_class_id` AS `color_class_id`,(select count(0) from `tjillepret`.`friendships` where ((`tjillepret`.`friendships`.`inviter_id` = `tjillepret`.`users`.`user_id`) or (`tjillepret`.`friendships`.`accepter_id` = `tjillepret`.`users`.`user_id`))) AS `friends`,(select count(0) from `tjillepret`.`posts` where (`tjillepret`.`posts`.`uploaded_by` = `tjillepret`.`users`.`user_id`)) AS `uploads`,(select count(0) from (`tjillepret`.`chat_members` join `tjillepret`.`chats` on(((`tjillepret`.`chats`.`chat_id` = `tjillepret`.`chat_members`.`chat_id`) and (`tjillepret`.`chats`.`is_group` = 1)))) where (`tjillepret`.`chat_members`.`user_id` = `tjillepret`.`users`.`user_id`)) AS `groups`,(select count(0) from `tjillepret`.`messages` where (`tjillepret`.`messages`.`sent_by` = `tjillepret`.`users`.`user_id`)) AS `messages`,(((select count(0) from (`tjillepret`.`post_votes` join `tjillepret`.`posts` on((`tjillepret`.`posts`.`post_id` = `tjillepret`.`post_votes`.`post_id`))) where ((`tjillepret`.`post_votes`.`up` = 1) and (`tjillepret`.`posts`.`uploaded_by` = `tjillepret`.`users`.`user_id`))) - (select count(0) from (`tjillepret`.`post_votes` join `tjillepret`.`posts` on((`tjillepret`.`posts`.`post_id` = `tjillepret`.`post_votes`.`post_id`))) where ((`tjillepret`.`post_votes`.`up` = 0) and (`tjillepret`.`posts`.`uploaded_by` = `tjillepret`.`users`.`user_id`)))) + ((select count(0) from (`tjillepret`.`comment_votes` join `tjillepret`.`comments` on((`tjillepret`.`comments`.`comment_id` = `tjillepret`.`comment_votes`.`comment_id`))) where ((`tjillepret`.`comment_votes`.`up` = 1) and (`tjillepret`.`comments`.`user_id` = `tjillepret`.`users`.`user_id`))) - (select count(0) from (`tjillepret`.`comment_votes` join `tjillepret`.`comments` on((`tjillepret`.`comments`.`comment_id` = `tjillepret`.`comment_votes`.`comment_id`))) where ((`tjillepret`.`comment_votes`.`up` = 0) and (`tjillepret`.`comments`.`user_id` = `tjillepret`.`users`.`user_id`))))) AS `rep`,(select sum(`tjillepret`.`posts`.`views`) from `tjillepret`.`posts` where (`tjillepret`.`posts`.`uploaded_by` = `tjillepret`.`users`.`user_id`)) AS `views`,(select count(0) from `tjillepret`.`comments` where (`tjillepret`.`comments`.`user_id` = `tjillepret`.`users`.`user_id`)) AS `comments` from `tjillepret`.`users`;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
