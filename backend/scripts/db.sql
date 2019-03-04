USE nerdtech;

INSERT INTO `users` (`id`, `username`, `firstName`, `lastName`, `email`, `telephone`, `passwordHash`, `admin`, `birthdate`)
VALUES (NULL, 'admin', 'admin', 'admin', 'admin@admin.com', '1234567891', md5('adminadmin'), '1', '2019-03-03 00:00:00');