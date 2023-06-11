package logs

import (
	"log"
	"os"
)

var InfoLogger log.Logger
var ErrLogger log.Logger

func Init() {
	InfoLogger = *log.New(os.Stdout, "INFO:\t", log.Ldate|log.Ltime)
	ErrLogger = *log.New(os.Stderr, "ERROR:\t", log.Ldate|log.Ltime|log.Lshortfile)
}
