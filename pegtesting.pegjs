// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer / Constant / DataAccess / DataRange / Aggregate

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
  
Constant "constant"
  = name:("population" / "day" / "first" / "last") {
  	switch (name) {
   	  case "population": return 1000;
      case "day": return 10;
      case "first": return 1;
      case "last": return 100;
    }
  }
  
DataAccess
  = name:("cases" / "deaths") _ "(" _ expr:Expression _ ")" {
    if (name === "cases") {
      return 100 * expr;
    } else if (name === "deaths") {
      return expr;
    }
  }

DataRange
  = name:("cases" / "deaths") _ "(" _ expr1:Expression _ "," _ expr2:Expression _ ")" {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(expr1, expr2);
  }
  
Aggregate
  = name:("max" / "min") _ "(" _ range:DataRange _ ")" {
    if (name === "max") {
      return range.reduce((acc, x) => {
        return acc > x ? acc : x;
      }, range[0]);
    } else if (name == "min") {
      return range.reduce((acc, x) => {
        return acc < x ? acc : x;
      }, range[0]);
    }
  }