package com.hilkojj.tjilpret.activities.utils

import android.content.Context
import android.graphics.Color


class ThemeColors(context: Context, red: Int, green: Int, blue: Int) {

    init {

        val colorStep = 15
        val r = Math.round((red / colorStep).toFloat()) * colorStep
        val g = Math.round((green / colorStep).toFloat()) * colorStep
        val b = Math.round((blue / colorStep).toFloat()) * colorStep

        val stringColor = Integer.toHexString(Color.rgb(r, g, b)).substring(2)

        context.setTheme(context.resources.getIdentifier("T_$stringColor", "style", context.packageName))
    }

}