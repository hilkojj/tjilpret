package com.hilkojj.tjilpret

class UserSession(
        val username: String,
        val token: String
) {

    lateinit var userInfo: HashMap<*, *>

    var valid: Boolean = true

    init {

        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", mutableSetOf())

        if (!storedUsers.contains(username))
            storedUsers.add(username)

        with(Tjilpret.prefs.edit()) {
            putStringSet("stored_users", storedUsers)
            putString("user_token->$username", token)
            apply()
        }

        println("new UserSession created for $username")
    }

    fun finishSession() {
        if (Tjilpret.userSession == this)
            Tjilpret.userSession = null
    }

}