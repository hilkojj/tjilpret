package com.hilkojj.tjilpret.activities.utils

import android.support.design.widget.Snackbar
import android.view.View
import android.widget.TextView
import com.hilkojj.tjilpret.R

object SnackbarUtils {

    fun errorSnackbar(view: View, text: String, duration: Int) {
        val snackbar = Snackbar.make(view, text, duration)

        val snackbarLayout = snackbar.view
        val textView = snackbarLayout.findViewById(android.support.design.R.id.snackbar_text) as TextView
        textView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_error_outline_red_24dp, 0, 0, 0)
        textView.compoundDrawablePadding = 50
        snackbar.show()
    }

    fun successSnackbar(view: View, text: String, duration: Int) {
        val snackbar = Snackbar.make(view, text, duration)

        val snackbarLayout = snackbar.view
        val textView = snackbarLayout.findViewById(android.support.design.R.id.snackbar_text) as TextView
        textView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_done_green_24dp, 0, 0, 0)
        textView.compoundDrawablePadding = 50
        snackbar.show()
    }

}