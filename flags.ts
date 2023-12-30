export type Data = { [key: string]: unknown };
export interface Flag {
  name: string;
  code: string;
  data?: Data;
  lvl?: number;
  lock?: string;
  add?: (data: Data) => Data;
  remove?: (data: Data) => Data;
}

export class Flags {
  flags: Flag[];

  /**
   * Create a new Flags Object.
   * @param flags An optional list of Flags to initialize the Flag object with.
   */
  constructor(...flags: Flag[]) {
    this.flags = flags;
  }

  /**
   * Add new flags to the flag system.
   * @param flag The flag to be added to the system
   */
  add(...flags: Flag[]) {
    flags.forEach((flag) => this._add(flag));
  }

  /**
   * Add a flag to the flags system.
   * @param flag The flag to be added to the system
   */
  private _add(flag: Flag) {
    const t = this.flags.find(
      (tg) => tg.name.toLowerCase() === flag.name.toLowerCase(),
    );

    // If the flag exists, map through the flags and look for it.
    if (t) {
      this.flags = this.flags.map((tg) => {
        if (t.name.toLowerCase() === tg.name.toLowerCase()) {
          return {
            name: t.name.toLowerCase(),
            code: flag.code,
            lvl: flag.lvl || 0,
          };
        } else {
          return tg;
        }
      });
    } else {
      flag.lvl = flag.lvl ? flag.lvl : 0;
      this.flags.push(flag);
    }
  }

  /**
   * Get the highest level within a list of flags.
   * @param flags The flag list to check against
   */
  lvl(flags: string) {
    const list = flags?.split(" ") || [];
    return list.reduce((acc = 0, cur: string) => {
      const flag = this.exists(cur);
      return acc < (flag?.lvl || 0) ? flag.lvl : acc;
    }, 0);
  }

  /**
   * Check to see if a flag exists, if it does - return the entire flag object,
   * @param t The flag to check for
   */
  exists(t: string) {
    return this.flags.filter(
      (flag) => flag.name.toLowerCase() === t.toLowerCase() || flag.code === t,
    )[0];
  }

  /**
   * Get a list of codes for a given list of flags
   * @param flags The list of flags you want to get codes for.
   * @returns
   */
  codes(flags: string) {
    return flags
      .split(" ")
      .map((flag) => this.exists(flag) && this.exists(flag).code)
      .reduce((a, b) => (a += b), "");
  }

  /**
   *  Check a list of flags against a flag expression.
   * @param list The list of flags to check.
   * @param flagExpr The expression string to check flags against.
   */
  check(list: string, flagExpr: string) {
    const flags = flagExpr.split(" ").filter(Boolean);
    if (flags.length === 0) return true;

    const listArray = new Set(list.split(" ").filter(Boolean));

    return flags.every((flag) => {
      if (flag.includes("|")) {
        return flag.split("|").some((expr) =>
          this.compareFlag(expr, listArray)
        );
      } else if (flag.endsWith("+")) {
        const baseFlag = flag.slice(0, -1);
        const flagExists = this.exists(baseFlag);
        return flagExists && (this.lvl(list) ?? 0) >= (flagExists?.lvl ?? 0);
      } else {
        return this.compareFlag(flag, listArray);
      }
    });
  }

  private compareFlag(flag: string, listArray: Set<string>): boolean {
    const negated = flag.startsWith("!");
    const normalizedFlag = negated ? flag.slice(1) : flag;
    return negated !== listArray.has(normalizedFlag);
  }

  /**
   * Set a flag string + data object for setting flags.
   * @param flags The existing list of flags to modify
   * @param data Any flag data that already exsits
   * @param expr The expression to evaluate for new flags.
   */
  set(flags: string, data: { [key: string]: unknown }, expr: string) {
    const list = expr.split(" ");
    const flagSet = new Set(flags?.split(" ") || []);

    list.forEach((item) => {
      const flag = this.exists(item);
      if (item.startsWith("!")) {
        flagSet.delete(item.slice(1));
        delete data[item.slice(1)];

        // check for flag.remove
        if (flag && flag.remove) {
          data = flag.remove(data);
        }
      } else if (flag) {
        flagSet.add(flag.name);
        if (
          flag.data && !Object.prototype.hasOwnProperty.call(data, flag.name)
        ) {
          data[flag.name] = flag.data;
        }

        // check for flag.add
        if (flag && flag.add) {
          data = flag.add(data);
        }
      }
    });
    return {
      flags: Array.from(flagSet).join(" ").trim(),
      data,
    };
  }
}
