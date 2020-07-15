abstract class ScalarExpr {
    public abstract evaluate(): number;
}

abstract class ArrayExpr {
    public abstract evaluate(): number[];
}

class NumberNode extends ScalarExpr {
    private value: number;

    constructor(valueStr: string) {
        super();
        this.value = parseInt(valueStr, 10);
    }

    public evaluate(): number {
        return this.value;
    }
}

class ConstantNode extends ScalarExpr {
    constructor(private name: string) {
        super();
    }

    public evaluate(): number {
        return this.getConstantValue(this.name);
    }

    private getConstantValue(name: string): number {
        switch(name) {
            case "population": return 1000;
            case "day": return 10;
            case "first": return 0;
            case "last": return 10;
            default: throw "Invalid constant in ConstantNode";
        }
    }
}

class DataAccessNode extends ScalarExpr {
    constructor(private name: string, private indexExpr: ScalarExpr) {
        super();
    }

    public evaluate(): number {
        if (this.name === "cases") {
            return 100 * this.indexExpr.evaluate();
        } else if (this.name === "deaths") {
            return this.indexExpr.evaluate();
        } else {
            throw "Invalid dataset in DataAccessNode";
        }
    }
}

class DataRangeNode extends ArrayExpr {
    constructor(private name: string, private startExpr: ScalarExpr, private endExpr: ScalarExpr) {
        super();
    }

    public evaluate(): number[] {
        var dataSet: number[];
        if (this.name === "cases") {
            dataSet = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        } else if (this.name === "deaths") {
            dataSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        } else {
            throw "Invalid dataset in DataRangeNode";
        }

        const startIndex = this.startExpr.evaluate();
        const endIndex = this.endExpr.evaluate();
        return dataSet.slice(startIndex, endIndex);
    }
}

class AggregateNode extends ScalarExpr {
    constructor(private name: string, private rangeExpr: ArrayExpr) {
        super();
    }

    public evaluate(): number {
        const range = this.rangeExpr.evaluate();

        if (this.name === "max") {
            return range.reduce((acc, x) => acc > x ? acc : x, range[0]);
        } else if (this.name == "min") {
            return range.reduce((acc, x) => acc < x ? acc : x, range[0]);
        } else {
            throw "Unsupported aggregate function";
        }
    }
}

class BinopNode extends ScalarExpr {
    constructor(private operator: string, private expr1: ScalarExpr, private expr2: ScalarExpr) {
        super();
    }

    public evaluate(): number {
        const val1 = this.expr1.evaluate();
        const val2 = this.expr2.evaluate();

        if (this.operator === "+") {
            return val1 + val2;
        } else if (this.operator === "-") {
            return val1 - val2;
        } else if (this.operator === "*") {
            return val1 * val2;
        } else if (this.operator === "/") {
            return val1 / val2;
        } else {
            throw "Unsupported binary operation"
        }
    }
}