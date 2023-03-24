import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import {
  ANNOTATION_CREATE,
  ANNOTATION_CREATE_ERROR,
  ANNOTATION_CREATE_SUCCESS,
  ANNOTATION_DELETE,
  ANNOTATION_DELETE_ERROR,
  ANNOTATION_DELETE_SUCCESS,
  ANNOTATION_UPDATE,
  ANNOTATION_UPDATE_ERROR,
  ANNOTATION_UPDATE_SUCCESS,
  LEAVE_ROOM,
  LEAVE_ROOM_ERROR,
  LEAVE_ROOM_SUCCESS,
  REGISTER_ROOM,
  REGISTER_ROOM_ERROR,
  REGISTER_ROOM_SUCCESS,
} from '../models/annotation-socket-events';
import {
  AnnotationCreateSuccessEvent,
  AnnotationDeleteErrorEvent,
  AnnotationDeleteSuccessEvent,
  AnnotationUpdateErrorEvent,
  AnnotationUpdateSuccessEvent,
  ErrorEvent,
  LeaveRoomErrorEvent,
  LeaveRoomSuccessEvent,
  RegisterRoomErrorEvent,
  RegisterRoomSuccessEvent,
} from '../models/annotation-events.model';
import { Annotation } from '../models/annotation.model';
import { ConfigurationService } from '../../configuration/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsSocketService extends Socket {
  /**
   * The current stream id
   */
  currentVideoId: number;

  /**
   * New annotation socket messages
   */
  annotationCreateSuccess$ = this.fromEvent<AnnotationCreateSuccessEvent>(
    ANNOTATION_CREATE_SUCCESS,
  );
  annotationCreateError$ = this.fromEvent<ErrorEvent>(ANNOTATION_CREATE_ERROR);

  /**
   * Annotation updated socket messages
   */
  annotationUpdateSuccess$ = this.fromEvent<AnnotationUpdateSuccessEvent>(
    ANNOTATION_UPDATE_SUCCESS,
  );
  annotationUpdateError$ = this.fromEvent<AnnotationUpdateErrorEvent>(
    ANNOTATION_UPDATE_ERROR,
  );

  /**
   * Annotation deleted socket messages
   */
  annotationDeleteSuccess$ = this.fromEvent<AnnotationDeleteSuccessEvent>(
    ANNOTATION_DELETE_SUCCESS,
  );
  annotationDeleteError$ = this.fromEvent<AnnotationDeleteErrorEvent>(
    ANNOTATION_DELETE_ERROR,
  );

  /**
   * Register room notification socket messages
   */
  registerRoomSuccess$ = this.fromEvent<RegisterRoomSuccessEvent>(
    REGISTER_ROOM_SUCCESS,
  );
  registerRoomError$ = this.fromEvent<RegisterRoomErrorEvent>(
    REGISTER_ROOM_ERROR,
  );

  /**
   * Leave room notification socket messages
   */
  leaveRoomSuccess$ = this.fromEvent<LeaveRoomSuccessEvent>(LEAVE_ROOM_SUCCESS);
  leaveRoomError$ = this.fromEvent<LeaveRoomErrorEvent>(LEAVE_ROOM_ERROR);

  constructor(private readonly configurationService: ConfigurationService) {
    super({
      url: `${configurationService.configuration.socketConfig.baseUrl}/annotations`,
      options: {
        transports: configurationService.configuration.socketConfig.opts.transports.split(
          configurationService.configuration.separator,
        ),
      },
    });
  }

  join(videoId: number): void {
    if (this.currentVideoId !== videoId) {
      this.currentVideoId = videoId;
      this.emit(REGISTER_ROOM, videoId);
    }
  }

  leave(videoId: number): void {
    this.currentVideoId = null;
    this.emit(LEAVE_ROOM, videoId);
  }

  create(createPayload: Annotation): void {
    this.emit(ANNOTATION_CREATE, createPayload);
  }

  update(updatePayload: Partial<Annotation>): void {
    this.emit(ANNOTATION_UPDATE, updatePayload);
  }

  delete(deleteId: number): void {
    this.emit(ANNOTATION_DELETE, deleteId);
  }
}
