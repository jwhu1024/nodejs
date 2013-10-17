#include <stdio.h>
#include "czmq.h"

#define IPC_SUB  "tcp://127.0.0.1:5565"
#define IPC_PUSH "tcp://127.0.0.1:7777"

int main (int argc, char *argv [])
{
	while (1) {
		printf("Start to listening...\n");
		
		//  Create a new socket
		zctx_t *context = zctx_new ();

		// subscriber initialize
		void *subscriber = zsocket_new (context, ZMQ_SUB);
		zsocket_connect (subscriber, IPC_SUB);
		zsocket_set_subscribe (subscriber, "");

		// Create a new empty message object
		zmsg_t *msg = zmsg_new ();
		
		// Receive message from socket
		msg = zmsg_recv(subscriber);

		// for debug
		zmsg_t *dup = zmsg_dup (msg);
		char *szkey = zmsg_popstr (msg);
		char *szdata = zmsg_popstr (msg);
		printf("key : %s, value : %s\n", szkey, szdata);
		
		// pusher initialize
		void *pusher = zsocket_new (context, ZMQ_PUSH);
		zsocket_bind (pusher, IPC_PUSH);
		
		// send back the data
		zmsg_send(&dup, pusher);
		
		// Destroy a message object and all frames it contains
		zmsg_destroy (&msg);
		zmsg_destroy (&dup);
		zsocket_destroy (context, subscriber);
		zsocket_destroy (context, pusher);
		zctx_destroy (&context);
		
		sleep(2);
	}
    return 0;
}

/*
{code:title=cSub.c|borderStyle=solid}
#include <stdio.h>
#include "czmq.h"

#define IPC_SUB  "tcp://127.0.0.1:5565"
#define IPC_PUSH "tcp://127.0.0.1:7777"

int main (int argc, char *argv [])
{
    while (1) {
 	printf("Start to listening...\n");

	//  Create a new socket
	zctx_t *context = zctx_new ();

	// subscriber initialize
	void *subscriber = zsocket_new (context, ZMQ_SUB);
	zsocket_connect (subscriber, IPC_SUB);
	zsocket_set_subscribe (subscriber, "");

	// Create a new empty message object
	zmsg_t *msg = zmsg_new ();
		
	// Receive message from socket
	msg = zmsg_recv(subscriber);

	// for debug
	zmsg_t *dup = zmsg_dup (msg);
	char *szkey = zmsg_popstr (msg);
	char *szdata = zmsg_popstr (msg);
	printf("key : %s, value : %s\n", szkey, szdata);
		
	// pusher initialize
	void *pusher = zsocket_new (context, ZMQ_PUSH);
	zsocket_bind (pusher, IPC_PUSH);
		
	// send back the data
	zmsg_send(&dup, pusher);
		
	// Destroy a message object and all frames it contains
	zmsg_destroy (&msg);
	zmsg_destroy (&dup);
	zsocket_destroy (context, subscriber);
	zsocket_destroy (context, pusher);
	zctx_destroy (&context);
        free(szkey);
        free(szdata);
		
	sleep(2);
    }
    return 0;
}

{code} 
*/
