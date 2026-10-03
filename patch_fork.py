#!/usr/bin/env python3
from pathlib import Path
import sys

root = Path(sys.argv[1]).resolve()
shell_src = Path(sys.argv[2]).resolve()


def rw(rel, fn):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    p.write_text(fn(s), encoding='utf-8')

# Only our built-in module. No Vanilla+, EUI or CUI presets.
(root / 'app/src/main/java/com/github/wrager/sbgscout/script/preset/PresetScripts.kt').write_text('''package com.github.wrager.sbgscout.script.preset

import com.github.wrager.sbgscout.script.model.ScriptIdentifier

object PresetScripts {
    val SCI_FI = PresetScript(
        identifier = ScriptIdentifier("github.com/Arzdezes/sbg-encha-bencha/sci-fi-client"),
        displayName = "SBG Sci-Fi Client",
        downloadUrl = "https://raw.githubusercontent.com/Arzdezes/sbg-encha-bencha/master/sbg-scifi-client.user.js",
        updateUrl = null,
        enabledByDefault = true,
        description = "Visual-only shell for SBG. No automation or gameplay advantage.",
    )

    val ALL: List<PresetScript> = listOf(SCI_FI)
    val BUNDLED: List<PresetScript> = listOf(SCI_FI)
}
''', encoding='utf-8')

# There are no third-party preset conflicts in this fork.
(root / 'app/src/main/java/com/github/wrager/sbgscout/script/preset/StaticConflictRules.kt').write_text('''package com.github.wrager.sbgscout.script.preset

class StaticConflictRules : ConflictRuleProvider {
    override fun getRules(): List<ConflictRule> = emptyList()
}
''', encoding='utf-8')

# Point the bundled installer at our own asset.
rw(
    'app/src/main/java/com/github/wrager/sbgscout/script/installer/BundledScriptInstaller.kt',
    lambda s: s.replace(
        'PresetScripts.SVP.identifier to "scripts/sbg-vanilla-plus.user.js"',
        'PresetScripts.SCI_FI.identifier to "scripts/sbg-scifi-client.user.js"',
    ),
)

# Keep the native settings minimal. Script manager/update UI is intentionally not exposed.
(root / 'app/src/main/res/xml/preferences.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <PreferenceCategory
        android:title="@string/settings_category_display"
        app:iconSpaceReserved="false">

        <SwitchPreferenceCompat
            android:defaultValue="false"
            android:key="fullscreen_mode"
            android:summary="@string/settings_fullscreen_summary"
            android:title="@string/settings_fullscreen"
            app:iconSpaceReserved="false" />

        <SwitchPreferenceCompat
            android:defaultValue="true"
            android:key="keep_screen_on"
            android:summary="@string/settings_keep_screen_on_summary"
            android:title="@string/settings_keep_screen_on"
            app:iconSpaceReserved="false" />

        <SwitchPreferenceCompat
            android:defaultValue="true"
            android:key="lock_portrait_orientation"
            android:summary="@string/settings_lock_portrait_orientation_summary"
            android:title="@string/settings_lock_portrait_orientation"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

    <PreferenceCategory
        android:title="@string/settings_category_game"
        app:iconSpaceReserved="false">

        <Preference
            android:key="reload_game"
            android:summary="@string/settings_reload_game_summary"
            android:title="@string/reload_game"
            app:iconSpaceReserved="false" />

        <Preference
            android:key="open_links_in_app"
            android:summary="@string/settings_open_links_in_app_summary"
            android:title="@string/settings_open_links_in_app"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

    <PreferenceCategory
        android:title="@string/settings_category_about"
        app:iconSpaceReserved="false">

        <Preference
            android:key="app_version"
            android:title="@string/settings_version"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

</PreferenceScreen>
''', encoding='utf-8')

# Remove handlers/imports for settings entries that no longer exist.
p = root / 'app/src/main/java/com/github/wrager/sbgscout/settings/SettingsFragment.kt'
s = p.read_text(encoding='utf-8').replace(
    'import com.github.wrager.sbgscout.launcher.ScriptListFragment\n', ''
)
for block in [
'''        requirePref<Preference>("manage_scripts").setOnPreferenceClickListener {
            parentFragmentManager.beginTransaction()
                .replace(R.id.settingsContainer, ScriptListFragment.newEmbeddedInstance())
                .addToBackStack(null)
                .commit()
            true
        }

''',
'''        requirePref<Preference>("check_app_update").setOnPreferenceClickListener {
            gameActivity.showAppUpdateCheckDialog()
            true
        }

''',
'''        requirePref<Preference>("check_script_updates").setOnPreferenceClickListener {
            parentFragmentManager.beginTransaction()
                .replace(R.id.settingsContainer, ScriptListFragment.newEmbeddedAutoCheckInstance())
                .addToBackStack(null)
                .commit()
            true
        }

''',
'''        requirePref<Preference>("report_bug").setOnPreferenceClickListener {
            reportBug()
            true
        }
''',
]:
    s = s.replace(block, '')
p.write_text(s, encoding='utf-8')

# Disable automatic app/script update UI hooks and upstream download beacon.
p = root / 'app/src/main/java/com/github/wrager/sbgscout/GameActivity.kt'
s = p.read_text(encoding='utf-8')
s = s.replace('import com.github.wrager.sbgscout.script.installer.BundledScriptBeacon\n', '')
s = s.replace('        scheduleAutoUpdateCheck(prefs)\n', '')
s = s.replace('''        val bundledScriptBeacon = BundledScriptBeacon(httpFetcher, preferences)
        lifecycleScope.launch(Dispatchers.IO) { bundledScriptBeacon.ping() }
''', '')
p.write_text(s, encoding='utf-8')

# Separate app identity/version.
rw(
    'app/build.gradle.kts',
    lambda s: s
    .replace(
        'applicationId = "com.github.wrager.sbgscout"',
        'applicationId = "com.github.arzdezes.sbgscifi"',
    )
    .replace(
        'val versionMajor = 1\n        val versionMinor = 2\n        val versionPatch = 0',
        'val versionMajor = 0\n        val versionMinor = 7\n        val versionPatch = 0',
    ),
)

# Rename visible app/settings strings.
for rel in [
    'app/src/main/res/values/strings.xml',
    'app/src/main/res/values-ru/strings.xml',
]:
    rw(
        rel,
        lambda s: s
        .replace('>SBG Scout<', '>SBG Sci-Fi Client<')
        .replace('SBG Scout settings', 'SBG Sci-Fi Client settings')
        .replace('Настройки SBG Scout', 'Настройки SBG Sci-Fi Client'),
    )

# Bundle only our shell. Vanilla+ is deliberately absent from the APK.
asset_dir = root / 'app/src/main/assets/scripts'
(asset_dir / 'sbg-scifi-client.user.js').write_text(
    shell_src.read_text(encoding='utf-8'), encoding='utf-8'
)
(asset_dir / 'sbg-vanilla-plus.user.js').unlink(missing_ok=True)

print('Patched clean SBG Sci-Fi Client:', root)
