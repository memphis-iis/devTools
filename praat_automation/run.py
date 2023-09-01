import os
import shutil
import subprocess
import win32gui
import pyautogui
import time

if __name__ == '__main__':
    praat_script = '_ProsodyPro.praat'
    subprocess.Popen(['praat.exe', '--send', praat_script])
    
    #make an loop until a window with the title "Pause: Press Done to exit" appears
    while True:
        try:
            hwnd = win32gui.FindWindow(None, "Pause: Press Done to exit")
            if hwnd:
                win32gui.SetForegroundWindow(hwnd)
                ## press the button lablled "Next"
                button_location = pyautogui.locateCenterOnScreen('next_button.png')
                pyautogui.click(button_location)
            else:
                ## wait for 1 seconds
                time.sleep(1)
        except:
            pass
        