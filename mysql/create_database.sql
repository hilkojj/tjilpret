-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema tjille_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tjille_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tjille_database` DEFAULT CHARACTER SET utf8 ;
USE `tjille_database` ;

-- -----------------------------------------------------
-- Table `tjille_database`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`categories` (
  `category_id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `header` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`color_classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`color_classes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(600) NOT NULL,
  `max_saturation` FLOAT NULL DEFAULT NULL,
  `max_hue` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`entities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`entities` (
  `entity_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL,
  PRIMARY KEY (`entity_id`),
  INDEX `fk_entities_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_entities_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`users` (
  `user_id` INT(11) NOT NULL,
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
  `sound_fragment` VARCHAR(45) NULL DEFAULT NULL,
  `wallpaper` VARCHAR(45) NULL DEFAULT NULL,
  `color_class_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `fk_users_color_classes1` (`color_class_id` ASC),
  CONSTRAINT `fk_users_color_classes1`
    FOREIGN KEY (`color_class_id`)
    REFERENCES `tjille_database`.`color_classes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_entities`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`entities` (`entity_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 291
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_520_ci;


-- -----------------------------------------------------
-- Table `tjille_database`.`chats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`chats` (
  `chat_id` INT(11) NOT NULL AUTO_INCREMENT,
  `started_by` INT(11) NOT NULL,
  `started_timestamp` INT(11) NOT NULL,
  `is_group` TINYINT(4) NOT NULL,
  `group_title` VARCHAR(64) NULL DEFAULT NULL,
  `group_pic` VARCHAR(45) NULL DEFAULT NULL,
  `group_description` VARCHAR(512) NULL DEFAULT NULL,
  `old_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`chat_id`, `started_by`),
  INDEX `fk_chat_users1_idx` (`started_by` ASC),
  CONSTRAINT `fk_chat_users1`
    FOREIGN KEY (`started_by`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 306
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`chat_members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`chat_members` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `joined_timestamp` BIGINT NOT NULL,
  `left_timestamp` BIGINT NULL,
  `is_chat_admin` TINYINT(4) NULL DEFAULT NULL,
  `muted` TINYINT(4) NULL DEFAULT NULL,
  `read_timestamp` INT NULL,
  `left_title` VARCHAR(64) NULL,
  `left_description` VARCHAR(512) NULL,
  PRIMARY KEY (`id`, `chat_id`, `user_id`),
  INDEX `fk_chat_members_chats1_idx` (`chat_id` ASC),
  INDEX `fk_chat_members_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_chat_members_chats1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `tjille_database`.`chats` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_members_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`friend_invites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`friend_invites` (
  `inviter_id` INT(11) NOT NULL,
  `invited_id` INT(11) NOT NULL,
  `time` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inviter_id`, `invited_id`),
  INDEX `fk_friend_invites_users2_idx` (`invited_id` ASC),
  CONSTRAINT `fk_friend_invites_users1`
    FOREIGN KEY (`inviter_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_friend_invites_users2`
    FOREIGN KEY (`invited_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`friendships`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`friendships` (
  `accepter_id` INT(11) NOT NULL,
  `inviter_id` INT(11) NOT NULL,
  `since` INT(11) NOT NULL,
  PRIMARY KEY (`accepter_id`, `inviter_id`),
  INDEX `fk_friendship_users2_idx` (`inviter_id` ASC),
  CONSTRAINT `fk_friendship_users1`
    FOREIGN KEY (`accepter_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_friendship_users2`
    FOREIGN KEY (`inviter_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`message_attachment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`message_attachment` (
  `attachment_id` INT(11) NOT NULL,
  `type` ENUM('giphy', 'upload') NOT NULL DEFAULT 'upload',
  `path` VARCHAR(255) NOT NULL,
  `thumbnail` VARCHAR(45) NULL,
  PRIMARY KEY (`attachment_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9977998
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `chat_id` INT(11) NOT NULL,
  `sent_by` INT(11) NOT NULL,
  `sent_timestamp` BIGINT NOT NULL,
  `text` VARCHAR(512) NOT NULL,
  `attachment_id` INT(11) NULL DEFAULT NULL,
  `old_time` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `chat_id`, `sent_by`),
  INDEX `fk_message_chat1_idx` (`chat_id` ASC),
  INDEX `fk_message_users1_idx` (`sent_by` ASC),
  INDEX `fk_message_message_media1_idx` (`attachment_id` ASC),
  CONSTRAINT `fk_message_chat1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `tjille_database`.`chats` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_message_media1`
    FOREIGN KEY (`attachment_id`)
    REFERENCES `tjille_database`.`message_attachment` (`attachment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_users1`
    FOREIGN KEY (`sent_by`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 11010
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`posts` (
  `post_id` INT(11) NOT NULL,
  `category_id` INT(11) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(2048) NOT NULL,
  `uploaded_on` INT(11) NOT NULL,
  `type` ENUM('img', 'vid', 'gif') NOT NULL,
  `path` VARCHAR(45) NOT NULL,
  `thumbnail_path` VARCHAR(45) NOT NULL,
  `views` INT(11) NOT NULL DEFAULT '0',
  `duration` INT(11) NULL DEFAULT NULL,
  `last_edited_by` INT NULL,
  `last_edited_time` INT NULL,
  PRIMARY KEY (`post_id`, `category_id`),
  INDEX `fk_uploads_categories1_idx` (`category_id` ASC),
  INDEX `fk_posts_entities1_idx` (`post_id` ASC),
  CONSTRAINT `fk_uploads_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `tjille_database`.`categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_entities1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tjille_database`.`entities` (`entity_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 120
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`tokens` (
  `token` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `created` INT(11) NOT NULL,
  `expires` INT(11) NOT NULL,
  `user_agent` VARCHAR(512) NOT NULL DEFAULT 'unkown',
  `ip` VARCHAR(45) NOT NULL DEFAULT '0',
  PRIMARY KEY (`token`, `user_id`),
  INDEX `fk_tokens_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_tokens_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`entity_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`entity_comments` (
  `entity_id` INT(11) NOT NULL,
  `comment_on_entity_id` INT(11) NOT NULL,
  `time` INT(11) NOT NULL,
  `text` VARCHAR(1024) NULL,
  `giphy` VARCHAR(45) NULL,
  `deleted` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`entity_id`, `comment_on_entity_id`),
  INDEX `fk_entity_comments_entities2_idx` (`comment_on_entity_id` ASC),
  UNIQUE INDEX `entity_id_UNIQUE` (`entity_id` ASC),
  CONSTRAINT `fk_entity_comments_entities1`
    FOREIGN KEY (`entity_id`)
    REFERENCES `tjille_database`.`entities` (`entity_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_entity_comments_entities2`
    FOREIGN KEY (`comment_on_entity_id`)
    REFERENCES `tjille_database`.`entities` (`entity_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`entity_votes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`entity_votes` (
  `user_id` INT(11) NOT NULL,
  `entity_id` INT(11) NOT NULL,
  `up` TINYINT NOT NULL,
  `time` INT NOT NULL,
  PRIMARY KEY (`user_id`, `entity_id`),
  INDEX `fk_entity_votes_entities1_idx` (`entity_id` ASC),
  INDEX `fk_entity_votes_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_entity_votes_entities1`
    FOREIGN KEY (`entity_id`)
    REFERENCES `tjille_database`.`entities` (`entity_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_entity_votes_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`post_views`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`post_views` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `time` INT NOT NULL,
  PRIMARY KEY (`id`, `post_id`, `user_id`),
  INDEX `fk_post_view_users1_idx` (`user_id` ASC),
  INDEX `fk_post_view_posts1` (`post_id` ASC),
  CONSTRAINT `fk_post_view_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tjille_database`.`posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_post_view_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `string` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`post_has_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`post_has_tag` (
  `post_id` INT(11) NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  INDEX `fk_posts_has_tag_tag1_idx` (`tag_id` ASC),
  INDEX `fk_posts_has_tag_posts1_idx` (`post_id` ASC),
  CONSTRAINT `fk_posts_has_tag_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tjille_database`.`posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_has_tag_tag1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tjille_database`.`tags` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `tjille_database`.`emoticon_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`emoticon_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `example_emoticon` VARCHAR(40) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_emoticon_categories_emoticons1_idx` (`example_emoticon` ASC),
  CONSTRAINT `fk_emoticon_categories_emoticons1`
    FOREIGN KEY (`example_emoticon`)
    REFERENCES `tjille_database`.`emoticons` (`name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`emoticons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`emoticons` (
  `name` VARCHAR(40) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `category_id` INT NOT NULL,
  `time` INT NOT NULL,
  `times_used` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`name`, `user_id`, `category_id`),
  INDEX `fk_emoticons_users1_idx` (`user_id` ASC),
  INDEX `fk_emoticons_emoticon_categories1_idx` (`category_id` ASC),
  CONSTRAINT `fk_emoticons_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_emoticons_emoticon_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `tjille_database`.`emoticon_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`chat_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`chat_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chat_id` INT(11) NOT NULL,
  `type` ENUM('TITLE_CHANGED', 'DESCRIPTION_CHANGED', 'PICTURE_CHANGED', 'USER_ADDED', 'USER_REMOVED', 'USER_LEFT', 'OPPED', 'DEOPPED') NOT NULL,
  `timestamp` BIGINT NOT NULL,
  `by` INT NULL,
  `who` INT NULL,
  PRIMARY KEY (`id`, `chat_id`),
  INDEX `fk_chat_events_users1_idx` (`by` ASC),
  INDEX `fk_chat_events_users2_idx` (`who` ASC),
  INDEX `fk_chat_events_chats1_idx` (`chat_id` ASC),
  CONSTRAINT `fk_chat_events_users1`
    FOREIGN KEY (`by`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_events_users2`
    FOREIGN KEY (`who`)
    REFERENCES `tjille_database`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_events_chats1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `tjille_database`.`chats` (`chat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tjille_database`.`push_subscriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`push_subscriptions` (
  `endpoint` VARCHAR(500) NOT NULL,
  `token` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `auth_key` VARCHAR(500) NOT NULL,
  `p256dh_key` VARCHAR(500) NOT NULL,
  `timestamp` INT NOT NULL,
  `updated_timestamp` INT NULL,
  PRIMARY KEY (`endpoint`, `token`, `user_id`),
  UNIQUE INDEX `endpoint_UNIQUE` (`endpoint` ASC),
  CONSTRAINT `fk_push_subscriptions_tokens1`
    FOREIGN KEY (`token` , `user_id`)
    REFERENCES `tjille_database`.`tokens` (`token` , `user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `tjille_database` ;

-- -----------------------------------------------------
-- Placeholder table for view `tjille_database`.`user_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`user_info` (`user_id` INT, `username` INT, `password` INT, `joined_on` INT, `email` INT, `bio` INT, `is_admin` INT, `last_activity` INT, `online` INT, `checked_notifications_time` INT, `apple_user` INT, `r` INT, `g` INT, `b` INT, `profile_pic` INT, `header` INT, `sound_fragment` INT, `wallpaper` INT, `color_class_id` INT, `groups_started` INT, `friends` INT, `uploads` INT, `emoticons` INT, `messages` INT, `rep` INT, `views` INT, `comments` INT);

-- -----------------------------------------------------
-- Placeholder table for view `tjille_database`.`entity_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tjille_database`.`entity_view` (`entity_id` INT, `user_id` INT, `score` INT, `comments` INT);

-- -----------------------------------------------------
-- View `tjille_database`.`user_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tjille_database`.`user_info`;
USE `tjille_database`;
CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `user_info` AS
    SELECT 
        `users`.`user_id` AS `user_id`,
        `users`.`username` AS `username`,
        `users`.`password` AS `password`,
        `users`.`joined_on` AS `joined_on`,
        `users`.`email` AS `email`,
        `users`.`bio` AS `bio`,
        `users`.`is_admin` AS `is_admin`,
        `users`.`last_activity` AS `last_activity`,
        `users`.`online` AS `online`,
        `users`.`checked_notifications_time` AS `checked_notifications_time`,
        `users`.`apple_user` AS `apple_user`,
        `users`.`r` AS `r`,
        `users`.`g` AS `g`,
        `users`.`b` AS `b`,
        `users`.`profile_pic` AS `profile_pic`,
        `users`.`header` AS `header`,
        `users`.`sound_fragment` AS `sound_fragment`,
        `users`.`wallpaper` AS `wallpaper`,
        `users`.`color_class_id` AS `color_class_id`,
        (SELECT 
                COUNT(0)
            FROM
                `chats`
            WHERE
                (`chats`.`is_group`
                    AND (`chats`.`started_by` = `users`.`user_id`))) AS `groups_started`,
        (SELECT 
                COUNT(0)
            FROM
                `friendships`
            WHERE
                ((`friendships`.`inviter_id` = `users`.`user_id`)
                    OR (`friendships`.`accepter_id` = `users`.`user_id`))) AS `friends`,
        (SELECT 
                COUNT(0)
            FROM
                (`posts`
                JOIN `entities`)
            WHERE
                ((`entities`.`user_id` = `users`.`user_id`)
                    AND (`posts`.`post_id` = `entities`.`entity_id`))) AS `uploads`,
        (SELECT 
                COUNT(*)
			FROM
				emoticons
			WHERE emoticons.user_id = users.user_id) AS `emoticons`,
        (SELECT 
                COUNT(0)
            FROM
                `messages`
            WHERE
                (`messages`.`sent_by` = `users`.`user_id`)) AS `messages`,
        ((SELECT 
					COUNT(0)
			FROM
					(`entity_votes`
					JOIN `entities`)
			WHERE
					((`entity_votes`.`entity_id` = `entities`.`entity_id`)
							AND (`entities`.`user_id` = `users`.`user_id`)
							AND (`entity_votes`.`up` = 1) AND (entity_votes.user_id != users.user_id))) - (SELECT 
					COUNT(0)
			FROM
					(`entity_votes`
					JOIN `entities`)
			WHERE
					((`entity_votes`.`entity_id` = `entities`.`entity_id`)
							AND (`entities`.`user_id` = `users`.`user_id`)
							AND (`entity_votes`.`up` = 0) AND (entity_votes.user_id != users.user_id)))) AS `rep`,
        (SELECT 
                SUM(`posts`.`views`)
            FROM
                (`posts`
                JOIN `entities`)
            WHERE
                ((`entities`.`user_id` = `users`.`user_id`)
                    AND (`posts`.`post_id` = `entities`.`entity_id`))) AS `views`,
        (SELECT 
                COUNT(0)
            FROM
                (`entity_comments`
                JOIN `entities`)
            WHERE
                ((`entity_comments`.`entity_id` = `entities`.`entity_id`)
                    AND (`entities`.`user_id` = `users`.`user_id`))) AS `comments`
    FROM
        `users`;

-- -----------------------------------------------------
-- View `tjille_database`.`entity_view`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `tjille_database`.`entity_view`;
USE `tjille_database`;
CREATE  OR REPLACE VIEW entity_view AS
    SELECT 
        entities.entity_id AS entity_id,
        entities.user_id AS user_id,
        (SELECT 
                COALESCE((SUM(entity_votes.up) - (COUNT(0) - SUM(entity_votes.up))), 0)
            FROM
                entity_votes
            WHERE
                (entity_votes.entity_id = entities.entity_id)) AS score,
        (
			SELECT COUNT(*) FROM entity_comments
			LEFT JOIN entity_comments AS sub ON (
				sub.comment_on_entity_id = entity_comments.entity_id
				OR
				sub.entity_id = entity_comments.entity_id
			)
			WHERE entity_comments.comment_on_entity_id = entities.entity_id
        ) AS comments
    FROM
        entities;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
