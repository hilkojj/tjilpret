package com.hilkojj.tjilpret

import org.json.JSONObject

class User(
        val id: Int,
        var username: String,
        var bio: String,
        var admin: Boolean,
        var lastActivity: Int,
        var online: Boolean,
        var appleUser: Boolean,
        var r: Int, var g: Int, var b: Int,
        var profilePic: String, var header: String) : Model() {

    constructor(u: JSONObject) : this(
            u.getInt("id"),
            u.getString("username"),
            u.getString("bio"),
            u.getBoolean("admin"),
            u.getInt("lastActivity"),
            u.getBoolean("online"),
            u.getBoolean("appleUser"),
            u.getInt("r"), u.getInt("g"), u.getInt("b"),
            u.getString("profilePic"), u.getString("header")
    )

    enum class ProfilePicSize(val path: String) {

        SMALL("small/"),
        MEDIUM("med/"),
        LARGE("large/"),
        ORIGINAL("")

    }

    fun profilePicPath(size: ProfilePicSize): String {
        return Tjilpret.URL + "static_content/profile_pics/" + (
                if (profilePic == "null") "default.jpg" else size.path + profilePic
        )
    }

}