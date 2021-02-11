dec2bin = function(a) {
  var set = [];
  var bin = Number(a).toString(2);
  for (var i=bin.length-2;i>=0;--i) {
    if (bin[i] == "1") {
      set.push(bin.length-i-1);
    }
  }
  console.log(set);
};

T = function(a, het=false) {
  var tmp = b(a, het);
  console.log("So tap hop:", tmp[0]);
  for (i=0;i<a.length; i++) {
    console.log("Bac cua", a[i], ":", tmp[1][a[i]]);
  }
  var visited = {};
  var regions = [];
  var visitedCount=0;
  console.log("List:", tmp[2]);
  while (visitedCount <= tmp[2].length) {
    for (i=0;i<tmp[2].length;++i) {
        var changed = false;
      for(j=0;j<regions.length;++j){
        var failed = false;
        var inside = false;
        for(k=0;k<regions[j].length;++k) {
          if (regions[j][k] == tmp[2][i]) {
            inside = true;
            break;
          }
          if (regions[j][k] != tmp[2][i] && (regions[j][k] & tmp[2][i]) == 0) {
            failed = true;
            break;
          }
        }
        if (!inside && !failed) {
            regions[j].push(tmp[2][i]);
          changed = true;
        }
      }
      if (changed == false) {
        regions.push([tmp[2][i]]);
        visitedCount += 1;
      }
    }
  }
  var maxLength = 0;
  var maxJ = 0;
  for (var j=0;j<regions.length;++j) {
    if (maxLength < regions[j].length) {
       maxLength = regions[j].length;
       maxJ = j;
    }
  }
  console.log("Max |F|:", maxLength);
  for (var index=0;index<regions[maxJ].length;++index){
    dec2bin(regions[maxJ][index]);
  }
};

arr2dec = function(arr) {
  return arr.reduce(function(x,y){return x + 2**(y-1);}, 0);
}

get_degree = function(arr, val) {
  var indexes = [], i;
  for(i = 0; i < arr.length; i++)
    if (arr[i] === val)
      indexes.push(i);
  return indexes;
}

find_degree = function(sets) {
  var numbers = sets.map(arr2dec);
  console.log(numbers);
  var deg = new Array(numbers.length);
  for (var i=0;i<numbers.length;i++) {
    for (var j=i+1;j<numbers.length;j++) {
      if (i == j) {
        continue;
      }
      if (isNaN(deg[i])) {
        deg[i] = 0;
      }
      if (isNaN(deg[j])) {
        deg[j] = 0;
      }
      if (Number(numbers[i] & numbers[j]) == 0) {
        ++deg[i];
        ++deg[j];
      }
    }
  }

  return deg;
}

gen_set = function(a) {
  var stack = [];
  stack.push({
    val: 0,
    arr: a,
    curr: 1,
    res: []
  });
  var result = [];
  do {
    if (stack[0].arr.length == 1) {
      var oldItem = stack.shift();
      var parentItem = stack[0];
      for (var i =1; i <= oldItem.arr[0]; ++i) {
        parentItem.res.push([oldItem.val, oldItem.val + i]);
      }
      ++parentItem.curr;
    }
    var workItem = stack[0];
    if (workItem.curr > workItem.arr[0]) {
      stack.shift();
      result = workItem.res.map(function(x) { return x.map(function(y){return y + workItem.val})});
      if (stack.length > 0) {
        stack[0].res = stack[0].res.concat(result);
        ++stack[0].curr;
        result.map(function(x) {return x.unshift(workItem.val)});
      }
      continue;
    }

    stack.unshift({
      val: workItem.curr,
      arr: workItem.arr.slice(1, workItem.length).map(function(x){return x - workItem.curr;}),
      curr: 1,
      res: []
    });
  } while (stack.length > 0);

  return result;
}

b = function(a, het=false) {
    if (a.length === 1) {
            var bac = {};
        var set = [];
        for (var i=1;i<=a[0];i++) {
            bac[i] = 1;
          set.push(2**i);
        }
        return [a[0], bac, set];
    }
    var s = 0;
    var bac = {};
    var finalset = [];
    for (var i = 1; i <= a[0]; ++i) {
        var c = [];
        for (var j = 1; j < a.length; ++j) {
            c.push(a[j] - i);
        }
        var tmp = b(c,het);
        s += tmp[0];
        for (key in tmp[1]) {
            var k = Number(key);
            bac[k +i] += tmp[1][k];
            if (isNaN(bac[k+i])) {
            bac[k+i] = tmp[1][k];
          }
        }
        for (m in tmp[2]) {
          tmp[2][m] = tmp[2][m] * 2**(i) + 2**(i);
        }
        finalset = finalset.concat(tmp[2]);
        bac[i] += tmp[0];
        if (isNaN(bac[i])) {
          bac[i] = tmp[0];
        }
    }
    return [s, bac, finalset];
};

d = function(a) {
    var a1 = [];
    a1.push(a[1] - 1);
    for (var i = 2; i < a.length; i++) {
        a1.push(a[i] - 2);
    }
    return b(a) - b(a1) - b(a.slice(0, a.length - 1));
};
e = function(a) {
    var s = "";
    var t = 0;
    for (var i = 1; i < a.length; i++) {
        var f = [];
        for (var j = i; j < a.length; j++) {
            f.push(a[j] - i - 1);
        }
        var x = b(f);
        s += x.toString() + "+";
        t += x;
    }
    return s + "1=" + (t + 1).toString();
}
