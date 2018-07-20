CREATE 
    ALGORITHM = UNDEFINED 
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
                COUNT(0)
            FROM
                (`chat_members`
                JOIN `chats` ON (((`chats`.`chat_id` = `chat_members`.`chat_id`)
                    AND (`chats`.`is_group` = 1))))
            WHERE
                (`chat_members`.`user_id` = `users`.`user_id`)) AS `groups`,
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
                    AND (`entity_votes`.`up` = 1))) - (SELECT 
                COUNT(0)
            FROM
                (`entity_votes`
                JOIN `entities`)
            WHERE
                ((`entity_votes`.`entity_id` = `entities`.`entity_id`)
                    AND (`entities`.`user_id` = `users`.`user_id`)
                    AND (`entity_votes`.`up` = 0)))) AS `rep`,
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
        `users`