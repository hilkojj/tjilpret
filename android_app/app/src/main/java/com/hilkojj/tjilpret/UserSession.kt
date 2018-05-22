package com.hilkojj.tjilpret

class UserSession(
        user: User,
        token: String
) {

    init {

        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", mutableSetOf())

        if (!storedUsers.contains(user.username))
            storedUsers.add(user.username)

        with(Tjilpret.prefs.edit()) {
            putStringSet("stored_users", storedUsers)
            putString("user_token->${user.username}", token)
            apply()
        }

        println("new UserSession created for ${user.username}")
    }

}