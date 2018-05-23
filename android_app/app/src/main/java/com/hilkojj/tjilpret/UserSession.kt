package com.hilkojj.tjilpret

class UserSession(
        val user: User,
        val token: Int
) {

    init {

        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", mutableSetOf())

        if (!storedUsers.contains(user.id.toString()))
            storedUsers.add(user.id.toString())

        with(Tjilpret.prefs.edit()) {
            putStringSet("stored_users", storedUsers)
            putInt("user_token->${user.id}", token)
            apply()
        }

        println("new UserSession created for ${user.username}")
    }

}