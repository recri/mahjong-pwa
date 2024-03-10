#!/usr/bin/tclsh

set dpi1 75
set dpi2 500
set font1 10
array set points {}
for {set i $dpi1} {$i < $dpi2} {incr i} {
    set px [expr {1+round(double($i)/double($dpi1)*double($font1))}]
    while {$px & 3} { incr px }
    lappend points($px) $i
}

foreach px [lsort -decreasing -integer [array names points]] {
    set first [lindex $points($px) 0]
    set last [lindex $points($px) end]
    # puts "${px}px ${first}dpi ${last}dpi"
    puts "@media screen and (min-resolution: ${first}dpi) and (max-resolution: ${last}dpi) \{"
    puts "  body \{"
    puts "    font-size: ${px}px;"
    puts "  \}"
    puts "\}"
}
