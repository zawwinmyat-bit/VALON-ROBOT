/** 
 * @file pxt-yfrobot-valon/valon.ts
 * @brief YFROBOT's VALON makecode library.
 * @n This is a MakeCode graphical programming education robot.
 * 
 * @copyright    YFROBOT,2020
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2020-07-22
*/

// ultrasonic pin
let valonUltrasonicTrig = DigitalPin.P5
let valonUltrasonicEcho = DigitalPin.P11
let distanceBuf = 0
// motor pin 
let valonMotorLD = DigitalPin.P13
let valonMotorLA = AnalogPin.P14
let valonMotorRD = DigitalPin.P15
let valonMotorRA = AnalogPin.P16
// patrol pin
let valonPatrolLeft = DigitalPin.P1
let valonPatrolMiddle = DigitalPin.P2
let valonPatrolRight = DigitalPin.P8
// rgbled pin
let valonEyesPin = DigitalPin.P11

enum PingUnit {
    //% block="cm"
    Centimeters,
}

//% color="#7BD239" weight=10 icon="\uf1b0"
namespace valon {

    // IR
    const MICROBIT_MAKERBIT_IR_NEC = 777
    const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789
    const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790
    const IR_REPEAT = 256
    const IR_INCOMPLETE = 257

    let irState: IrState
    interface IrState {
        protocol: IrProtocol;
        command: number;
        hasNewCommand: boolean;
        bitsReceived: uint8;
        commandBits: uint8;
    }

    export enum Motors {
        //% blockId="leftMotor" block="left"
        ML = 0,
        //% blockId="rightMotor" block="right"
        MR = 1,
        //% blockId="allMotors" block="all"
        MAll = 2
    }

    export enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Backward"
        CCW = 0x1
    }

    export enum PatrolEnable {
        //% blockId="PatrolOn" block="ON"
        PatrolOn = 0x01,
        //% blockId="PatrolOff" block="OFF"
        PatrolOff = 0x00
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 1,
        //% blockId="patrolMiddle" block="middle"
        PatrolMiddle = 2,
        //% blockId="patrolRight" block="right"
        PatrolRight = 8
    }

    export enum LED {
        //% blockId="LEDLeft" block="left"
        LEDLeft = 10,
        //% blockId="LEDRight" block="right"
        LEDRight = 9,
        //% blockId="LEDAll" block="all"
        LEDAll = 0
    }

    export enum LEDswitch {
        //% blockId="turnOn" block="ON"
        turnOn = 0x01,
        //% blockId="turnOff" block="OFF"
        turnOff = 0x00
    }

    /**
     * Different modes for RGB or RGB+W NeoPixel strips
     */
    export enum EyesMode {
        //% block="GRB"
        RGB = 1,
        //% block="RGB"
        RGB_RGB = 3,
        //% block="RGB+W"
        RGBW = 2
    }

    export enum RGBEYES {
        //% blockId="RGBLEDLeft" block="left"
        EyesLeft = 1,
        //% blockId="RGBLEDLeft" block="right"
        EyesRight = 0,
        //% blockId="RGBLEDLeft" block="all"
        EyesAll = 2
    }
    /**
     * Pre-Defined LED colours
     */
    export enum EyesColors {
        //% block=red
        Red = 0xff0000,
        //% block=orange
        Orange = 0xffa500,
        //% block=yellow
        Yellow = 0xffff00,
        //% block=green
        Green = 0x00ff00,
        //% block=blue
        Blue = 0x0000ff,
        //% block=indigo
        Indigo = 0x4b0082,
        //% block=violet
        Violet = 0x8a2be2,
        //% block=purple
        Purple = 0xff00ff,
        //% block=white
        White = 0xffffff,
        //% block=black
        Black = 0x000000
    }

    // IR
    export enum IrProtocol {
        //% block="Keyestudio"
        Keyestudio = 0,
        //% block="NEC"
        NEC = 1,
    }

    export enum IrButtonAction {
        //% block="pressed"
        Pressed = 0,
        //% block="released"
        Released = 1,
    }

    export enum IrButton {
        // any button
        //% block="Any"
        Any = -1,

        //IR HANDLE
        //% block="↑"
        UP = 0x11,
        //% block="↓"
        DOWN = 0x91,
        //% block="←"
        LEFT = 0x81,
        //% block="→"
        RIGHT = 0xa1,
        //% block="M1"
        M1 = 0xe9,
        //% block="M2"
        M2 = 0x69,
        //% block="A"
        A = 0x21,
        //% block="B"
        B = 0x01,

        // MINI IR 
        //% block="A"
        Mini_A = 0xa2,
        //% block="B"
        Mini_B = 0x62,
        //% block="C"
        Mini_C = 0xe2,
        //% block="D"
        Mini_D = 0x22,
        //% block="︿"
        Mini_UP = 0x02,
        //% block="E"
        Mini_E = 0xc2,
        //% block="＜"
        Mini_Left = 0xe0,
        //% block="۞"
        Mini_SET = 0xa8,
        //% block="＞"
        Mini_Right = 0x90,
        //% block="0"
        Number_0 = 0x68,
        //% block="﹀"
        Mini_Down = 0x98,
        //% block="F"
        Mini_F = 0xb0,
        //% block="1"
        Number_1 = 0x30,
        //% block="2"
        Number_2 = 0x18,
        //% block="3"
        Number_3 = 0x7a,
        //% block="4"
        Number_4 = 0x10,
        //% block="5"
        Number_5 = 0x38,
        //% block="6"
        Number_6 = 0x5a,
        //% block="7"
        Number_7 = 0x42,
        //% block="8"
        Number_8 = 0x4a,
        //% block="9"
        Number_9 = 0x52,
    }

    /**
     * Turn on/off the LEDs.
     */
    //% weight=120
    //% blockId=writeLED block="LEDlight |%ledn turn |%ledswitch"
    //% ledn.fieldEditor="gridpicker" ledn.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(ledn: LED, ledswitch: LEDswitch): void {
        led.enable(false);
        if (ledn == LED.LEDLeft) {
            pins.digitalWritePin(DigitalPin.P10, ledswitch);
        } else if (ledn == LED.LEDRight) {
            pins.digitalWritePin(DigitalPin.P9, ledswitch);
        } else if (ledn == LED.LEDAll){
            pins.digitalWritePin(DigitalPin.P10, ledswitch);
            pins.digitalWritePin(DigitalPin.P9, ledswitch);
        } else {
            return
        }
    }

    function clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(max, value), min);
    }

    /**
     * Set the direction and speed of valon motor.
     * @param index motor left/right/all
     * @param direction direction to turn
     * @param speed speed of motors (0 to 255). eg: 120
     */
    //% weight=90
    //% blockId=motor_MotorRun block="motor|%index|move|%direction|at speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        if (index > 2 || index < 0)
            return

        speed = clamp(speed, 0, 255) * 4.01;  // 0~255 > 0~1023

        if (index == valon.Motors.ML) {
            pins.digitalWritePin(valonMotorLD, direction);
            pins.analogWritePin(valonMotorLA, speed);
        } else if (index == Motors.MR) {
            pins.digitalWritePin(valonMotorRD, direction);
            pins.analogWritePin(valonMotorRA, speed);
        } else if (index == Motors.MAll) {
            pins.digitalWritePin(valonMotorRD, direction);
            pins.analogWritePin(valonMotorRA, speed);
            pins.digitalWritePin(valonMotorLD, direction);
            pins.analogWritePin(valonMotorLA, speed);
        }
    }

    /**
     * Stop the valon motor.
     */
    //% weight=89
    //% blockId=motor_motorStop block="motor |%motor stop"
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=2 
    export function motorStop(motor: Motors): void {
        motorRun(motor, 0, 0);
    }

    /**
     * Read ultrasonic sensor.
     */
    //% blockId=ultrasonic_sensor block="read ultrasonic sensor |%unit "
    //% weight=80
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        // send pulse
        pins.setPull(valonUltrasonicTrig, PinPullMode.PullNone);
        pins.digitalWritePin(valonUltrasonicTrig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(valonUltrasonicTrig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(valonUltrasonicTrig, 0);

        // read pulse
        // d = pins.pulseIn(valonUltrasonicEcho, PulseValue.High, maxCmDistance * 58);  // 8 / 340 = 
        d = pins.pulseIn(valonUltrasonicEcho, PulseValue.High, 25000);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;

        return Math.floor(ret * 9 / 6 / 58);
        // switch (unit) {
        //     case ValonPingUnit.Centimeters: return Math.idiv(d, 58);
        //     default: return d;
        // }
    }

    /**
      * Enable or Disable line tracking sensor.
      * @param enable line tracking sensor enable signal(0 or 1), eg: valon.PatrolEnable.PatrolOn
      */
    //% weight=71
    //% blockId=Patrol_enable block="%enable line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function enablePatrol(enable: PatrolEnable): void {
        pins.digitalWritePin(DigitalPin.P12, enable);
        pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
    }

    /**
      * Read line tracking sensor.
      * @param patrol patrol sensor number.
      */
    //% weight=70
    //% blockId=read_Patrol block="read %patrol line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(valonPatrolLeft)
        } else if (patrol == Patrol.PatrolMiddle) {
            return pins.digitalReadPin(valonPatrolMiddle)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(valonPatrolRight)
        } else {
            return -1
        }
    }

    /**
     * A NeoPixel strip
     */
    export class Strip {
        buf: Buffer;
        D_pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number;          // start offset in LED strip
        _length: number;        // number of LEDs
        _mode: EyesMode;
        _matrixWidth: number;   // number of leds in a matrix - if any

        /**
         * Set LED to a given color (range 0-255 for r, g, b).
         * @param eyes_n position of the NeoPixel in the strip
         * @param rgb RGB color of the LED. 
         */
        //% blockId="set_eyes_color" block="%eyes|show color at %eyes_n|to %rgb=neopixel_colors"
        //% eyes.defl=eyes
        //% weight=60
        setEyesColor(eyes_n: RGBEYES, rgb: EyesColors): void {
            if (eyes_n == RGBEYES.EyesAll) {
                this.setPixelRGB(RGBEYES.EyesLeft, rgb >> 0);
                this.setPixelRGB(RGBEYES.EyesRight, rgb >> 0);
            } else {
                this.setPixelRGB(eyes_n, rgb >> 0);
            }
            this.show();
        }

        /**
         * Set the brightness of the strip. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% blockId="eyes_set_brightness" block="%eyes|set brightness %brightness" 
        //% eyes.defl=eyes
        //% weight=58
        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        /**
         * Turn off all LEDs.
         * You need to call ``show`` to make the changes visible.
         */
        //% blockId="eyes_clear" block="%eyes|clear"
        //% eyes.defl=eyes
        //% weight=55
        clear(): void {
            const stride = this._mode === EyesMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        /**
         * Send all the changes to the eyes.
         */
        //% blockId="eyes_show" block="%eyes|show" 
        //% eyes.defl=eyes
        //% weight=35
        //% advanced=true
        show() {
            // only supported in beta
            // ws2812b.setBufferMode(this.pin, this._mode);
            ws2812b.sendBuffer(this.buf, this.D_pin);
        }

        /**
         * Shows all LEDs to a given color (range 0-255 for r, g, b).
         * @param rgb RGB color of the LED. 
         */
        //% blockId="eyes_set_color" block="%eyes|show color %rgb=neopixel_colors"
        //% eyes.defl=eyes
        //% weight=40
        //% advanced=true
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b).
         * You need to call ``show`` to make the changes visible.
         * @param pixeloffset position of the NeoPixel in the eyes. eg: 1
         * @param rgb RGB color of the LED. 
         */
        //% blockId="eyes_set_pixel_color" block="%eyes|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
        //% eyes.defl=eyes
        //% weight=38
        //% advanced=true
        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Set the pin where the neopixel is connected, defaults to P11.
         */
        setPin(pin: DigitalPin): void {
            this.D_pin = pin;
            pins.digitalWritePin(this.D_pin, 0);
            // don't yield to avoid races on initialization
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === EyesMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === EyesMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === EyesMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
    }

    /**
     *  Create a new NeoPixel driver for eye's LEDs.
     *  @param numleds number of leds in the eyes, eg: 2
     *  @param mode rgb mode, eg: valon.EyesMode.RGB
     */
    //% blockId="eyes_create" block="RGBEyes init %numleds|leds as %mode"
    //% weight=62  
    //% blockSetVariable=eyes
    export function create(numleds: number, mode: EyesMode): Strip {
        let eyes = new Strip();
        let stride = mode === EyesMode.RGBW ? 4 : 3;
        eyes.buf = pins.createBuffer(numleds * stride);
        eyes.start = 0;
        eyes._length = numleds;
        eyes._mode = mode || EyesMode.RGB;
        eyes._matrixWidth = 0;
        eyes.setBrightness(128)
        eyes.setPin(valonEyesPin)
        return eyes;
    }

    /**
    * Gets the RGB value of a known color
    */
    //% weight=30  
    //% blockId="neopixel_colors" block="%color"
    //% advanced=true
    export function colors(color: EyesColors): number {
        return color;
    }

    /**
     * Converts red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=26
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    //% advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360. eg: 100
     * @param s saturation from 0 to 99. eg: 50
     * @param l luminosity from 0 to 99. eg: 50
     */
    //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
    //% advanced=true
    //% weight=20
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }

    /***************** IR *******************/
    
    function pushBit(bit: number): number {
        irState.bitsReceived += 1;
        if (irState.bitsReceived <= 8) {
            // ignore all address bits
            if (irState.protocol === IrProtocol.Keyestudio && bit === 1) {
                // recover from missing message bits at the beginning
                // Keyestudio address is 0 and thus missing bits can be easily detected
                // by checking for the first inverse address bit (which is a 1)
                irState.bitsReceived = 9;
            }
            return IR_INCOMPLETE;
        }
        if (irState.bitsReceived <= 16) {
            // ignore all inverse address bits
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived < 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived === 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return irState.commandBits & 0xff;
        } else {
            // ignore all inverse command bits
            return IR_INCOMPLETE;
        }
    }

    function detectCommand(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            // low bit
            return pushBit(0);
        } else if (markAndSpace < 2700) {
            // high bit
            return pushBit(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            // Repeat detected
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            // Start detected
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            const command = detectCommand(mark + space);
            if (command !== IR_INCOMPLETE) {
                control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, command);
            }
        });
    }

    /**
     * Connects to the IR receiver module at the specified pin and configures the IR protocol.
     * @param pin IR receiver pin. eg: DigitalPin.P3
     * @param protocol IR protocol. eg: valon.IrProtocol.NEC
     */
    //% subcategory="IR Receiver"
    //% blockId="makerbit_infrared_connect_receiver"
    //% block="connect IR receiver at pin %pin and decode %protocol"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false"
    //% weight=15
    export function connectIrReceiver(pin: DigitalPin, protocol: IrProtocol): void {
        if (irState) {
            return;
        }

        irState = {
            protocol: protocol,
            bitsReceived: 0,
            commandBits: 0,
            command: IrButton.Any,
            hasNewCommand: false,
        };

        enableIrMarkSpaceDetection(pin);

        let activeCommand = IR_INCOMPLETE;
        let repeatTimeout = 0;
        const REPEAT_TIMEOUT_MS = 120;

        control.onEvent(
            MICROBIT_MAKERBIT_IR_NEC,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                const necValue = control.eventValue();

                // Refresh repeat timer
                if (necValue <= 255 || necValue === IR_REPEAT) {
                    repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
                }

                // Process a new command
                if (necValue <= 255 && necValue !== activeCommand) {
                    if (activeCommand >= 0) {
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                    }

                    irState.hasNewCommand = true;
                    irState.command = necValue;
                    activeCommand = necValue;
                    control.raiseEvent(MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID, necValue);
                }
            }
        );

        control.inBackground(() => {
            while (true) {
                if (activeCommand === IR_INCOMPLETE) {
                    // sleep to save CPU cylces
                    basic.pause(2 * REPEAT_TIMEOUT_MS);
                } else {
                    const now = input.runningTime();
                    if (now > repeatTimeout) {
                        // repeat timed out
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                        activeCommand = IR_INCOMPLETE;
                    } else {
                        basic.pause(REPEAT_TIMEOUT_MS);
                    }
                }
            }
        });
    }

    /**
     * Do something when a specific button is pressed or released on the remote control.
     * @param button the button to be checked
     * @param action the trigger action
     * @param handler body code to run when event is raised
     */
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_on_ir_button
    //% block="on IR button | %button | %action"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% weight=13
    export function onIrButton(button: IrButton, action: IrButtonAction, handler: () => void) {
        control.onEvent(
            action === IrButtonAction.Pressed
                ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
                : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
            button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
            () => {
                irState.command = control.eventValue();
                handler();
            }
        );
    }

    /**
     * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
     */
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_ir_button_pressed
    //% block="IR button"
    //% weight=10
    export function irButton(): number {
        if (!irState) {
            return IrButton.Any;
        }
        return irState.command;
    }

    /**
     * Returns true if any button was pressed since the last call of this function. False otherwise.
     */
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_was_any_button_pressed
    //% block="any IR button was pressed"
    //% weight=7
    export function wasAnyIrButtonPressed(): boolean {
        if (!irState) {
            return false;
        }
        if (irState.hasNewCommand) {
            irState.hasNewCommand = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the command code of a specific IR button.
     * @param button the button
     */
    //% subcategory="IR Receiver"
    //% blockId=makerbit_infrared_button_code
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button code %button"
    //% weight=5
    export function irButtonCode(button: IrButton): number {
        return button as number;
    }
}
