// Copyright 2006-2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// From typescript output
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : ((__ as any).prototype = b.prototype, new __());
}
// This is a JavaScript implementation of the Richards
// benchmark from:
//
//    http://www.cl.cam.ac.uk/~mr10/Bench.html
//
// The benchmark was originally implemented in BCPL by
// Martin Richards.
var COUNT = 1000;
/**
 * These two constants specify how many times a packet is queued and
 * how many times a task is put on hold in a correct run of richards.
 * They don't have any meaning a such but are characteristic of a
 * correct run so if the actual queue or hold count is different from
 * the expected there must be a bug in the implementation.
 **/
var EXPECTED_QUEUE_COUNT = 2322;
var EXPECTED_HOLD_COUNT = 928;
var ID_IDLE = 0;
var ID_WORKER = 1;
var ID_HANDLER_A = 2;
var ID_HANDLER_B = 3;
var ID_DEVICE_A = 4;
var ID_DEVICE_B = 5;
var NUMBER_OF_IDS = 6;
var KIND_DEVICE = 0;
var KIND_WORK = 1;
var DATA_SIZE = 4;
/**
 * The task is running and is currently scheduled.
 */
var STATE_RUNNING = 0;
/**
 * The task has packets left to process.
 */
var STATE_RUNNABLE = 1;
/**
 * The task is not currently running.  The task is not blocked as such and may
 * be started by the scheduler.
 */
var STATE_SUSPENDED = 2;
/**
 * The task is blocked and cannot be run until it is explicitly released.
 */
var STATE_HELD = 4;
var STATE_SUSPENDED_RUNNABLE = STATE_SUSPENDED | STATE_RUNNABLE;
var STATE_NOT_HELD = ~STATE_HELD;
function testRichards() {
    for (var i = 0; i < 1000; i++) {
        runRichards();
    }
}
/**
 * The Richards benchmark simulates the task dispatcher of an
 * operating system.
 **/
function runRichards() {
    var scheduler = new Scheduler();
    scheduler.addIdleTask(ID_IDLE, 0, undefined, COUNT);
    var queue = new Packet(undefined, ID_WORKER, KIND_WORK);
    queue = new Packet(queue, ID_WORKER, KIND_WORK);
    scheduler.addWorkerTask(ID_WORKER, 1000, queue);
    queue = new Packet(undefined, ID_DEVICE_A, KIND_DEVICE);
    queue = new Packet(queue, ID_DEVICE_A, KIND_DEVICE);
    queue = new Packet(queue, ID_DEVICE_A, KIND_DEVICE);
    scheduler.addHandlerTask(ID_HANDLER_A, 2000, queue);
    queue = new Packet(undefined, ID_DEVICE_B, KIND_DEVICE);
    queue = new Packet(queue, ID_DEVICE_B, KIND_DEVICE);
    queue = new Packet(queue, ID_DEVICE_B, KIND_DEVICE);
    scheduler.addHandlerTask(ID_HANDLER_B, 3000, queue);
    scheduler.addDeviceTask(ID_DEVICE_A, 4000, undefined);
    scheduler.addDeviceTask(ID_DEVICE_B, 5000, undefined);
    scheduler.schedule();
    if (scheduler.queueCount != EXPECTED_QUEUE_COUNT ||
        scheduler.holdCount != EXPECTED_HOLD_COUNT) {
        var msg = "Error during execution: queueCount = " + scheduler.queueCount +
            ", holdCount = " + scheduler.holdCount + ".";
        throw new Error(msg); //TODO
    }
}
/**
 * A scheduler can be used to schedule a set of tasks based on their relative
 * priorities.  Scheduling is done by maintaining a list of task control blocks
 * which holds tasks and the data queue they are processing.
 * @constructor
 */
var Scheduler = (function () {
    function Scheduler(this: declare Scheduler; 
        queueCount : !number = 0, //TODO: default argument assignments
        holdCount : !number = 0,
        blocks : !TaskControlBlock[] = new Array(NUMBER_OF_IDS),
        list : !TaskControlBlock|!undefined = undefined,
        currentTcb : !TaskControlBlock|!undefined = undefined,
        currentId:!number = -1) {
            this.queueCount = queueCount;
            this.holdCount = holdCount;
            this.blocks = blocks;
            this.list = list;
            this.currentTcb = currentTcb;
            this.currentId = currentId;
        }
    /**
     * Add an idle task to this scheduler.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     * @param {int} count the number of times to schedule the task
     */
    Scheduler.prototype.addIdleTask = function (id: !number, priority: !number, queue:!Packet, count: !number) {
        this.addRunningTask(id, priority, queue, new IdleTask(this, 1, count));
    };
    /**
     * Add a work task to this scheduler.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     */
    Scheduler.prototype.addWorkerTask = function (id:!number, priority:!number, queue:!Packet) {
        this.addTask(id, priority, queue, new WorkerTask(this, ID_HANDLER_A, 0));
    };
    /**
     * Add a handler task to this scheduler.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     */
    Scheduler.prototype.addHandlerTask = function (id:!number, priority:!number, queue:!Packet) {
        this.addTask(id, priority, queue, new HandlerTask(this));
    };
    /**
     * Add a handler task to this scheduler.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     */
    Scheduler.prototype.addDeviceTask = function (id:!number, priority:!number, queue:!Packet) {
        this.addTask(id, priority, queue, new DeviceTask(this));
    };
    /**
     * Add the specified task and mark it as running.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     * @param {Task} task the task to add
     */
    Scheduler.prototype.addRunningTask = function (id:!number, priority:!number, queue:!Packet, task:!Task) {
        this.addTask(id, priority, queue, task);
        this.currentTcb.setRunning();
    };
    /**
     * Add the specified task to this scheduler.
     * @param {int} id the identity of the task
     * @param {int} priority the task's priority
     * @param {Packet} queue the queue of work to be processed by the task
     * @param {Task} task the task to add
     */
    Scheduler.prototype.addTask = function(id:!number, priority:!number, queue:!Packet, task:!Task) {
        this.currentTcb = new TaskControlBlock(this.list, id, priority, queue, task);
        this.list = this.currentTcb;
        this.blocks[id] = this.currentTcb;
    };
    /**
     * Execute the tasks managed by this scheduler.
     */
    Scheduler.prototype.schedule = function () {
        this.currentTcb = this.list;
        while (this.currentTcb != undefined) {
            //console.log("+");
            if (this.currentTcb.isHeldOrSuspended()) {
                this.currentTcb = this.currentTcb.link;
            }
            else {
                this.currentId = this.currentTcb.id;
                this.currentTcb = this.currentTcb.run();
            }
        }
    };
    /**
     * Release a task that is currently blocked and return the next block to run.
     * @param {int} id the id of the task to suspend
     */
    Scheduler.prototype.release = function (id:!number): !TaskControlBlock {
        var tcb = this.blocks[id];
        if (tcb == undefined)
            return tcb;
        tcb.markAsNotHeld();
        if (tcb.priority > this.currentTcb.priority) {
            return tcb;
        }
        else {
            return this.currentTcb;
        }
    };
    /**
     * Block the currently executing task and return the next task control block
     * to run.  The blocked task will not be made runnable until it is explicitly
     * released, even if new work is added to it.
     */
    Scheduler.prototype.holdCurrent = function () {
        this.holdCount++;
        this.currentTcb.markAsHeld();
        return this.currentTcb.link;
    };
    /**
     * Suspend the currently executing task and return the next task control block
     * to run.  If new work is added to the suspended task it will be made runnable.
     */
    Scheduler.prototype.suspendCurrent = function () {
        this.currentTcb.markAsSuspended();
        return this.currentTcb;
    };
    /**
     * Add the specified packet to the end of the worklist used by the task
     * associated with the packet and make the task runnable if it is currently
     * suspended.
     * @param {Packet} packet the packet to add
     */
    Scheduler.prototype.queue = function (packet:!Packet): !TaskControlBlock {
        var t = this.blocks[packet.id];
        if (t == undefined)
            return t;
        this.queueCount++;
        packet.link = undefined;
        packet.id = this.currentId;
        return t.checkPriorityAdd(this.currentTcb, packet);
    };
    return Scheduler;
})();

var TaskControlBlock = (function () {
    /**
     * A task control block manages a task and the queue of work packages associated
     * with it.
     * @param {TaskControlBlock} link the preceding block in the linked block list
     * @param {int} id the id of this block
     * @param {int} priority the priority of this block
     * @param {Packet} queue the queue of packages to be processed by the task
     * @param {Task} task the task
     * @constructor
     */
    function TaskControlBlock(this: declare TaskControlBlock; link:!TaskControlBlock, id:!number, priority, queue:!Packet, task:!Task) {
        this.link = link;
        this.id = id;
        this.priority = priority;
        this.queue = queue;
        this.task = task;
        this.state = 0;
        if (this.queue === undefined) {
            this.state = STATE_SUSPENDED;
        }
        else {
            this.state = STATE_SUSPENDED_RUNNABLE;
        }
    }
    TaskControlBlock.prototype.setRunning = function () {
        this.state = STATE_RUNNING;
    };
    TaskControlBlock.prototype.markAsNotHeld = function () {
        this.state = this.state & STATE_NOT_HELD;
    };
    TaskControlBlock.prototype.markAsHeld = function () {
        this.state = this.state | STATE_HELD;
    };
    TaskControlBlock.prototype.isHeldOrSuspended = function () {
        return (this.state & STATE_HELD) != 0 || (this.state == STATE_SUSPENDED);
    };
    TaskControlBlock.prototype.markAsSuspended = function () {
        this.state = this.state | STATE_SUSPENDED;
    };
    TaskControlBlock.prototype.markAsRunnable = function () {
        this.state = this.state | STATE_RUNNABLE;
    };
    /**
     * Runs this task, if it is ready to be run, and returns the next task to run.
     */
    TaskControlBlock.prototype.run = function () {
        var packet = undefined;
        if (this.state == STATE_SUSPENDED_RUNNABLE) {
            packet = this.queue;
            this.queue = packet.link;
            if (this.queue == undefined) {
                this.state = STATE_RUNNING;
            }
            else {
                this.state = STATE_RUNNABLE;
            }
        }
        else {
            packet = undefined;
        }
        return this.task.run(packet);
    };
    /**
     * Adds a packet to the worklist of this block's task, marks this as runnable if
     * necessary, and returns the next runnable object to run (the one
     * with the highest priority).
     */
    TaskControlBlock.prototype.checkPriorityAdd = function (task:!TaskControlBlock, packet:!Packet) : !TaskControlBlock {
        if (this.queue == undefined) {
            this.queue = packet;
            this.markAsRunnable();
            if (this.priority > task.priority)
                return this;
        }
        else {
            this.queue = packet.addTo(this.queue);
        }
        return task;
    };
    TaskControlBlock.prototype.toString = function () {
        return "tcb { " + this.task + "@" + this.state + " }";
    };
    return TaskControlBlock;
})();
var Task = (function () {
    function Task(this: declare Task) {
    }
    Task.prototype.contructor = function () { };
    Task.prototype.run = function (packet:!Packet) {
        throw "Abstract method";
    };
    return Task;
})();
var IdleTask = (function () {
    __extends(IdleTask, Task);
    /**
     * An idle task doesn't do any work itself but cycles control between the two
     * device tasks.
     * @param {Scheduler} scheduler the scheduler that manages this task
     * @param {int} v1 a seed value that controls how the device tasks are scheduled
     * @param {int} count the number of times this task should be scheduled
     * @constructor
     */
    function IdleTask(this: declare IdleTask extends Task; scheduler: !Scheduler, v1 : !number, count: !number) {
        this.scheduler = scheduler;
        this.v1 = v1;
        this.count = count;
    }
    IdleTask.prototype.run = function (packet:!Packet): !TaskControlBlock {
        this.count--;
        if (this.count == 0)
            return this.scheduler.holdCurrent();
        if ((this.v1 & 1) == 0) {
            this.v1 = this.v1 >> 1;
            return this.scheduler.release(ID_DEVICE_A);
        }
        else {
            this.v1 = (this.v1 >> 1) ^ 0xD008;
            return this.scheduler.release(ID_DEVICE_B);
        }
    };
    IdleTask.prototype.toString = function () {
        return "IdleTask";
    };
    return IdleTask;
})();
var DeviceTask = (function () {
    __extends(DeviceTask, Task);
    /**
     * A task that suspends itself after each time it has been run to simulate
     * waiting for data from an external device.
     * @param {Scheduler} scheduler the scheduler that manages this task
     * @constructor
     */
    function DeviceTask(this: declare DeviceTask extends Task; scheduler: !Scheduler, v1: !Packet = undefined) {
        this.scheduler = scheduler;
        this.v1 = v1;
    }
    DeviceTask.prototype.run = function (packet: !Packet): !TaskControlBlock {
        if (packet == undefined) {
            if (this.v1 == undefined)
                return this.scheduler.suspendCurrent();
            var v = this.v1;
            this.v1 = undefined;
            return this.scheduler.queue(v);
        }
        else {
            this.v1 = packet;
            return this.scheduler.holdCurrent();
        }
    };
    DeviceTask.prototype.toString = function () {
        return "DeviceTask";
    };
    return DeviceTask;
})();
var WorkerTask = (function () {
    __extends(WorkerTask, Task);
    /**
     * A task that manipulates work packets.
     * @param {Scheduler} scheduler the scheduler that manages this task
     * @param {int} v1 a seed used to specify how work packets are manipulated
     * @param {int} v2 another seed used to specify how work packets are manipulated
     * @constructor
     */
    function WorkerTask(this: declare WorkerTask extends Task; scheduler: !Scheduler, v1: !number, v2: !number) {
        this.scheduler = scheduler;
        this.v1 = v1;
        this.v2 = v2;
    }
    WorkerTask.prototype.run = function (packet) {
        if (packet == undefined) {
            return this.scheduler.suspendCurrent();
        }
        else {
            if (this.v1 == ID_HANDLER_A) {
                this.v1 = ID_HANDLER_B;
            }
            else {
                this.v1 = ID_HANDLER_A;
            }
            packet.id = this.v1;
            packet.a1 = 0;
            for (var i = 0; i < DATA_SIZE; i++) {
                this.v2++;
                if (this.v2 > 26)
                    this.v2 = 1;
                packet.a2[i] = this.v2;
            }
            return this.scheduler.queue(packet);
        }
    };
    WorkerTask.prototype.toString = function () {
        return "WorkerTask";
    };
    return WorkerTask;
})();
var HandlerTask = (function () {
    __extends(HandlerTask, Task);
    /**
     * A task that manipulates work packets and then suspends itself.
     * @param {Scheduler} scheduler the scheduler that manages this task
     * @constructor
     */
    function HandlerTask(this: declare HandlerTask extends Task; scheduler: !Scheduler, v1: !undefined|!Packet = undefined, v2: !undefined|!Packet = undefined) {
        this.scheduler = scheduler;
        this.v1 = v1;
        this.v2 = v2;
    }
    HandlerTask.prototype.run = function (packet) {
        if (packet != undefined) {
            if (packet.kind == KIND_WORK) {
                this.v1 = packet.addTo(this.v1);
            }
            else {
                this.v2 = packet.addTo(this.v2);
            }
        }
        if (this.v1 != undefined) {
            var count = this.v1.a1;
            var v = undefined;
            if (count < DATA_SIZE) {
                if (this.v2 != undefined) {
                    v = this.v2;
                    this.v2 = this.v2.link;
                    v.a1 = this.v1.a2[count];
                    this.v1.a1 = count + 1;
                    return this.scheduler.queue(v);
                }
            }
            else {
                v = this.v1;
                this.v1 = this.v1.link;
                return this.scheduler.queue(v);
            }
        }
        return this.scheduler.suspendCurrent();
    };
    HandlerTask.prototype.toString = function () {
        return "HandlerTask";
    };
    return HandlerTask;
})();
/* --- *
 * P a c k e t
 * --- */
var Packet = (function () {
    /**
     * A simple package of data that is manipulated by the tasks.  The exact layout
     * of the payload data carried by a packet is not importaint, and neither is the
     * nature of the work performed on packets by the tasks.
     *
     * Besides carrying data, packets form linked lists and are hence used both as
     * data and worklists.
     * @param {Packet} link the tail of the linked list of packets
     * @param {int} id an ID for this packet
     * @param {int} kind the type of this packet
     * @constructor
     */
    function Packet(this: declare Packet;
                    link:!Packet, 
                    id:!number, 
                    kind:!number, 
                    a1:!number = 0) {
        this.link = link;
        this.id = id;
        this.kind = kind;
        this.a1 = a1;
        this.a2 = new Array(0);
        this.a2 = new Array(DATA_SIZE);
    }
    /**
     * Add this packet to the end of a worklist, and return the worklist.
     * @param {Packet} queue the worklist to add this packet to
     */
    Packet.prototype.addTo = function (queue: !Packet): !Packet {
        this.link = undefined;
        if (queue == undefined)
            return this;
        var peek = undefined;
        var next = queue;
        while ((peek = next.link) != undefined)
            next = peek;
        next.link = this;
        return queue;
    };
    Packet.prototype.toString = function () {
        return "Packet";
    };
    return Packet;
})();

testRichards();
