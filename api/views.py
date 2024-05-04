from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

# def main(request):
#   return HttpResponse("Hello")

class RoomView(generics.ListAPIView): # ListAPIViewで保存されているデータのリストを見る
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

class CreateRoomView(APIView): # 部屋を作るためのapi view
  
  serializer_class = CreateRoomSerializer
  
  def post(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key): # 有効なセッションキーがあるかのチェック
      self.request.session.create()
      
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      print(serializer.data["guest_can_pause"])
      guest_can_pause = serializer.data["guest_can_pause"]
      votes_to_skip = serializer.data["votes_to_skip"]
      host = self.request.session.session_key
      queryset = Room.objects.filter(host=host)
      
      if queryset.exists(): # 存在する場合はそれを更新する
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip
        room.save(update_fields=["guest_can_pause", "votes_to_skip"])
        self.request.session["room_code"] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
      
      else: # セッションが存在しない場合は新しく部屋を作る
        room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
        room.save()
        self.request.session["room_code"] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
    
    return Response({"Bad Request": "Invalid value..."}, status=status.HTTP_400_BAD_REQUEST)
  
class GetRoom(APIView):
  serializer_class = RoomSerializer
  lookup_url_kwarg = "code"
  
  def get(self, request, format=None):
    code = request.GET.get(self.lookup_url_kwarg)
    if code != None:
      room = Room.objects.filter(code=code)
      if len(room) > 0:
        data = RoomSerializer(room[0]).data # シリアライズデータ = python dict
        data["is_host"] = self.request.session.session_key == room[0].host
        return Response(data, status=status.HTTP_200_OK)
      
      return Response({"Room Not Found": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"Bad Request": "Code parameter not found in request"}, status=status.HTTP_404_NOT_FOUND)
  
class JoinRoom(APIView):
  
  lookup_url_kwarg = "code"
  def post(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()
      
    code = request.data.get(self.lookup_url_kwarg)
    if code != None:
      room_result = Room.objects.filter(code=code)
      if len(room_result) > 0:
        room = room_result[0]
        self.request.session["room_code"] = code
        return Response({"Message":"Room Joined"}, status=status.HTTP_200_OK)

      return Response({"Bad Request": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)
      
    return Response({"Bad Request": "Invalid post data, did not find a code key"}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
  def get(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key): # 有効なセッションキーがあるかのチェック
      self.request.session.create()
    
    data = {
      "code": self.request.session.get("room_code")
    }
    
    return JsonResponse(data, status=status.HTTP_200_OK)
  
class LeaveRoom(APIView):
  def post(self, request, format=None):
    if "room_code" in self.request.session:
      self.request.session["room_code"] = ""
      host_id = self.request.session.session_key
      room_result = Room.objects.filter(host=host_id)
      if len(room_result) > 0:
        room = room_result[0]
        room.delete()

    return Response({"Message": "Success"}, status=status.HTTP_200_OK)
  
class UpdateRoom(APIView):
  
  serializer_class = UpdateRoomSerializer
  
  def patch(self, request, format=None):
    
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()
    
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      guest_can_pause = serializer.data.get("guest_can_pause")
      votes_to_skip = serializer.data.get("votes_to_skip")
      code = serializer.data.get("code")
      
      queryset = Room.objects.filter(code=code)
      if not queryset.exists():
        return Response({"Message": "Room not found..."}, status=status.HTTP_404_NOT_FOUND)
      
      room = queryset[0]
      user_id = self.request.session.session_key
      if room.host != user_id:
        return Response({"Message": "You are not the host of this room"}, status=status.HTTP_403_FORBIDDEN)
      
      room.guest_can_pause = guest_can_pause
      room.votes_to_skip = votes_to_skip
      room.save(update_fields=["guest_can_pause", "votes_to_skip"])
      
      return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
    
    return Response({"Bad Request": "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
