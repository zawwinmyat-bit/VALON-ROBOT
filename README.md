 
# Valon-I

[Valon is an easy-to-use programming educational Robot](http://www.yfrobot.com.cn/wiki/index.php?title=Valon-I)

[Valon-I](https://item.taobao.com/item.htm?id=620974170340)

## Basic usage

* Set the direction and speed of Valon motor

```blocks
 valon.motorRun(valon.Motors.ML, valon.Dir.CW, 120)
 valon.motorRun(valon.Motors.MR, valon.Dir.CCW, 120)
```

* Read ultrasonic sensor

```blocks
basic.showNumber(valon.Ultrasonic(PingUnit.Centimeters))
```

* Stop the Valon motor 

```blocks
valon.motorStop(valon.Motors.ML)
```

* Read line tracking sensor

```blocks
valon.enablePatrol(valon.PatrolEnable.PatrolOff)
serial.writeNumber(valon.readPatrol(valon.Patrol.PatrolLeft))
```

* Turn on/off the LEDs

```blocks
valon.writeLED(valon.LED.LEDLeft, valon.LEDswitch.turnOn)
```

* Read IR sensor value

```blocks
basic.showNumber(valon.irButtonCode())
```
Support infrared mini controller and [infrared joystick controller](https://item.taobao.com/item.htm?id=623707734052)


## License

MIT


## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
