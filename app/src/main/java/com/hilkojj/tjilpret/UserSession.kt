package com.hilkojj.tjilpret

class UserSession(
        val username: String,
        val password: String
) {

    init {
        System.out.println("new UserSession created for $username")
    }

}