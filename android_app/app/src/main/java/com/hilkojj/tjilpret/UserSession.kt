package com.hilkojj.tjilpret

class UserSession(
        val user: User,
        val token: Int
) {

    init {

        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", mutableSetOf())

        if (!storedUsers.contains(user.username))
            storedUsers.add(user.username)

        with(Tjilpret.prefs.edit()) {
            putStringSet("stored_users", storedUsers)
            putString("user_token->${user.username}", token.toString())
            apply()
        }

        println("new UserSession created for ${user.username}")
    }

}