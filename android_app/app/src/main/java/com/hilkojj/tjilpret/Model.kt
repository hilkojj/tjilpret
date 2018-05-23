package com.hilkojj.tjilpret

abstract class Model {

    val onChangeListeners = ArrayList<Runnable>()

    fun onChange() {
        onChangeListeners.forEach { r -> r.run() }
    }

}