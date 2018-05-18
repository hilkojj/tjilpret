package com.hilkojj.tjilpret.activities.utils

import android.content.Context
import android.graphics.Color
import com.hilkojj.tjilpret.R


class ThemeColors(context: Context, red: Int, green: Int, blue: Int) {

    init {

        val colorStep = 15
        val r = Math.round((red / colorStep).toFloat()) * colorStep
        val g = Math.round((green / colorStep).toFloat()) * colorStep
        val b = Math.round((blue / colorStep).toFloat()) * colorStep

        val stringColor = Integer.toHexString(Color.rgb(r, g, b)).substring(2)

//        if ((r + g + b) / 3f > 200)
        context.setTheme(R.style.AppThemeDark)
        context.setTheme(context.resources.getIdentifier("T_$stringColor", "style", context.packageName))
    }

}