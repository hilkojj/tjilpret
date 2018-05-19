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

        Tjilpret.callHttpsFunction(
                "getUserInfo",
                hashMapOf(
                        "getInfoFor" to listOf(username)
                )
        ).continueWith { task ->

            val data = task.result.data as HashMap<*, *>
            if (data["success"] != true) {
                finishSession()
                return@continueWith
            }

            userInfo = ((task.result.data as HashMap<*, *>)["info"] as HashMap<*, *>)[username] as HashMap<*, *>
            println("UserInfo for $username: ")
            println(userInfo)
        }

        println("new UserSession created for $username")
    }

    fun finishSession() {
        if (Tjilpret.userSession == this)
            Tjilpret.userSession = null
    }

}